"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVisitorName } from "@/lib/visitorName";

/* ---------- 遊戲設定（想調難度改這裡） ---------- */
const LIVES = 3;
const GOLDEN_CHANCE = 0.1; // 金煌芒果出現機率（+3 分）
const BUG_CHANCE_START = 0.12; // 蟲出現機率，隨時間增加
const BUG_CHANCE_MAX = 0.28;
const BEST_KEY = "mango-catch-best";

type Status = "ready" | "playing" | "paused" | "over";
type Kind = "mango" | "golden" | "bug";
type Item = { x: number; y: number; vy: number; r: number; kind: Kind; img: number; rot: number; vr: number; done: boolean };
type Popup = { x: number; y: number; text: string; color: string; life: number };

// 用 Next 的圖片最佳化縮小芒果照片，遊戲載入比較快
const imageUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`;
const NORMAL_IMAGES = ["/images/cutout/irwin.png", "/images/cutout/mango-hero.png", "/images/cutout/keitt.png"];
const GOLDEN_IMAGE = "/images/cutout/jinhuang.png";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function MangoCatchGame() {
  const name = useVisitorName();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<{ normal: HTMLImageElement[]; golden: HTMLImageElement | null }>({ normal: [], golden: null });

  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);

  // 遊戲進行中的資料放 ref，避免每一格畫面都觸發 React 重新渲染
  const game = useRef({
    w: 0,
    h: 0,
    items: [] as Item[],
    popups: [] as Popup[],
    basketX: 0,
    targetX: 0,
    keys: { left: false, right: false },
    score: 0,
    lives: LIVES,
    elapsed: 0,
    spawnTimer: 0,
    shake: 0,
  });

  /* ---------- 繪圖 ---------- */
  const basketSize = () => {
    const { w } = game.current;
    const bw = Math.min(Math.max(w * 0.2, 80), 150);
    return { bw, bh: bw * 0.5 };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const g = game.current;
    const dpr = canvas.width / Math.max(g.w, 1);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, g.w, g.h);
    if (g.shake > 0) ctx.translate(random(-6, 6) * g.shake, random(-4, 4) * g.shake);

    // 掉落物
    for (const it of g.items) {
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.rot);
      if (it.kind === "bug") {
        ctx.font = `${it.r * 1.7}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐛", 0, 0);
      } else {
        const img = it.kind === "golden" ? imagesRef.current.golden : imagesRef.current.normal[it.img];
        if (it.kind === "golden") {
          ctx.shadowColor = "rgba(255, 196, 0, 0.9)";
          ctx.shadowBlur = 24;
        }
        if (img?.complete && img.naturalWidth) {
          ctx.drawImage(img, -it.r, -it.r, it.r * 2, it.r * 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, it.r * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = it.kind === "golden" ? "#f9b417" : "#f98b0b";
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 籃子
    const { bw, bh } = basketSize();
    const top = g.h - bh - 14;
    const cx = g.basketX;
    const grad = ctx.createLinearGradient(0, top, 0, top + bh);
    grad.addColorStop(0, "#d39a5c");
    grad.addColorStop(1, "#8a5a2b");
    ctx.beginPath();
    ctx.moveTo(cx - bw / 2, top);
    ctx.lineTo(cx + bw / 2, top);
    ctx.lineTo(cx + bw * 0.36, top + bh);
    ctx.lineTo(cx - bw * 0.36, top + bh);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.shadowColor = "rgba(146, 64, 14, 0.35)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = "transparent";
    // 編織紋路
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 2;
    for (let i = 1; i <= 2; i++) {
      const y = top + (bh * i) / 3;
      const inset = (bw / 2 - bw * 0.36) * (i / 3);
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2 + inset + 4, y);
      ctx.lineTo(cx + bw / 2 - inset - 4, y);
      ctx.stroke();
    }
    // 籃口
    ctx.fillStyle = "#b5763a";
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2 - 5, top - 6, bw + 10, 11, 6);
    ctx.fill();

    // 得分飄字
    ctx.textAlign = "center";
    ctx.font = "bold 22px system-ui, sans-serif";
    for (const p of g.popups) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }, []);

  /* ---------- 畫布尺寸（跟著容器、支援高解析螢幕） ---------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const g = game.current;
      const ratio = g.w ? g.basketX / g.w : 0.5;
      g.w = width;
      g.h = height;
      g.basketX = g.targetX = width * ratio;
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [draw]);

  /* ---------- 預載圖片 ---------- */
  useEffect(() => {
    const load = (src: string) => {
      const img = new Image();
      img.src = imageUrl(src);
      return img;
    };
    imagesRef.current = { normal: NORMAL_IMAGES.map(load), golden: load(GOLDEN_IMAGE) };
  }, []);

  /* ---------- 遊戲迴圈 ---------- */
  useEffect(() => {
    if (status !== "playing") return;
    let frame = 0;
    let last = performance.now();

    const endGame = () => {
      const final = game.current.score;
      const prev = readBest();
      const isNew = final > prev;
      if (isNew) {
        try {
          localStorage.setItem(BEST_KEY, String(final));
        } catch {}
      }
      setBest(Math.max(prev, final));
      setNewBest(isNew && final > 0);
      setStatus("over");
    };

    const loseLife = (x: number, y: number) => {
      const g = game.current;
      g.lives -= 1;
      g.shake = 1;
      g.popups.push({ x, y, text: "−❤", color: "#e2342b", life: 1 });
      setLives(g.lives);
      navigator.vibrate?.(60);
    };

    const tick = (now: number) => {
      const g = game.current;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      g.elapsed += dt;

      // 移動籃子：鍵盤或指標
      const { bw, bh } = basketSize();
      const dir = (g.keys.right ? 1 : 0) - (g.keys.left ? 1 : 0);
      if (dir) g.targetX += dir * g.w * 1.2 * dt;
      g.targetX = Math.min(Math.max(g.targetX, bw / 2), g.w - bw / 2);
      g.basketX += (g.targetX - g.basketX) * Math.min(1, dt * 16);

      // 生成掉落物：越玩越快
      g.spawnTimer -= dt;
      if (g.spawnTimer <= 0) {
        g.spawnTimer = Math.max(0.36, 0.95 - g.elapsed * 0.012);
        const bugChance = Math.min(BUG_CHANCE_START + g.elapsed * 0.004, BUG_CHANCE_MAX);
        const roll = Math.random();
        const kind: Kind = roll < bugChance ? "bug" : roll < bugChance + GOLDEN_CHANCE ? "golden" : "mango";
        const r = Math.min(Math.max(g.w * 0.055, 22), 34);
        const speed = Math.min(150 + g.elapsed * 5, 360) * (g.h / 600);
        g.items.push({
          x: random(r, g.w - r),
          y: -r,
          vy: speed * random(0.85, 1.15),
          r,
          kind,
          img: Math.floor(Math.random() * NORMAL_IMAGES.length),
          rot: random(-0.5, 0.5),
          vr: random(-1.5, 1.5),
          done: false,
        });
      }

      // 更新掉落物、判斷接住或漏接
      const rim = g.h - bh - 14;
      for (const it of g.items) {
        it.y += it.vy * dt;
        it.rot += it.vr * dt;
        if (it.done) continue;
        if (it.y + it.r * 0.4 >= rim && it.y - it.r * 0.4 <= rim + bh * 0.4) {
          if (Math.abs(it.x - g.basketX) < bw / 2) {
            it.done = true;
            it.y = g.h + 999; // 從畫面移除
            if (it.kind === "bug") {
              loseLife(g.basketX, rim - 20);
            } else {
              const points = it.kind === "golden" ? 3 : 1;
              g.score += points;
              setScore(g.score);
              g.popups.push({ x: g.basketX, y: rim - 20, text: `+${points}`, color: it.kind === "golden" ? "#d98a00" : "#dd6706", life: 1 });
            }
          }
        } else if (it.y - it.r > g.h) {
          it.done = true;
          if (it.kind !== "bug") loseLife(it.x, g.h - 30);
        }
      }
      g.items = g.items.filter((it) => it.y - it.r <= g.h);

      for (const p of g.popups) {
        p.y -= 50 * dt;
        p.life -= dt * 1.4;
      }
      g.popups = g.popups.filter((p) => p.life > 0);
      g.shake = Math.max(0, g.shake - dt * 3);

      draw();

      if (g.lives <= 0) {
        endGame();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, draw]);

  /* ---------- 鍵盤操作、切換分頁自動暫停 ---------- */
  useEffect(() => {
    const keyMap: Record<string, "left" | "right"> = { ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
    const onKey = (e: KeyboardEvent) => {
      const side = keyMap[e.key];
      if (!side) return;
      if (status === "playing") e.preventDefault();
      game.current.keys[side] = e.type === "keydown";
    };
    const onHide = () => {
      if (document.hidden) setStatus((s) => (s === "playing" ? "paused" : s));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [status]);

  const start = () => {
    const g = game.current;
    Object.assign(g, { items: [], popups: [], score: 0, lives: LIVES, elapsed: 0, spawnTimer: 0.4, shake: 0 });
    g.basketX = g.targetX = g.w / 2;
    setScore(0);
    setLives(LIVES);
    setNewBest(false);
    setStatus("playing");
  };

  const onPointer = (e: React.PointerEvent) => {
    if (status !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    game.current.targetX = e.clientX - rect.left;
  };

  return (
    <div className="glass relative overflow-hidden rounded-[2rem]">
      {/* 遊戲區 */}
      <div
        ref={wrapRef}
        onPointerDown={onPointer}
        onPointerMove={onPointer}
        className="relative aspect-[3/4] w-full touch-none bg-linear-to-b from-sky-100/60 via-mango-50/40 to-mango-100/70 select-none sm:aspect-[4/3]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="接芒果遊戲畫面" />

        {/* 分數列 */}
        {(status === "playing" || status === "paused") && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
            <div className="glass-strong rounded-full px-4 py-1.5 font-bold">
              🥭 <span className="tabular-nums">{score}</span> 分
            </div>
            <div className="flex items-center gap-2">
              <div className="glass-strong rounded-full px-3 py-1.5 tracking-widest" aria-label={`剩下 ${lives} 條命`}>
                {Array.from({ length: LIVES }, (_, i) => (
                  <span key={i} className={i < lives ? "" : "opacity-25 grayscale"}>
                    ❤️
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStatus((s) => (s === "playing" ? "paused" : "playing"))}
                aria-label={status === "playing" ? "暫停" : "繼續"}
                className="glass-strong pointer-events-auto grid size-9 place-items-center rounded-full transition-[scale] active:scale-[0.95]"
              >
                {status === "playing" ? "⏸" : "▶"}
              </button>
            </div>
          </div>
        )}

        {/* 開始 / 暫停 / 結束畫面 */}
        {status !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-white/30 p-4 backdrop-blur-[2px]">
            <div className="glass-strong w-full max-w-sm animate-pop-in rounded-[2rem] px-6 py-8 text-center">
              {status === "ready" && (
                <>
                  <p className="text-5xl">🧺</p>
                  <h2 className="mt-3 text-2xl font-black">接芒果大挑戰</h2>
                  <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                    <li>🥭 接到芒果 <b className="text-mango-600">+1 分</b></li>
                    <li>✨ 發光的金煌芒果 <b className="text-mango-600">+3 分</b></li>
                    <li>🐛 接到蟲、漏接芒果都會 <b className="text-[#e2342b]">扣一顆心</b></li>
                  </ul>
                  <p className="mt-4 text-xs text-ink-soft">電腦：滑鼠或 ← → 鍵移動　手機：手指左右滑</p>
                  <GameButton onClick={start}>開始遊戲</GameButton>
                </>
              )}
              {status === "paused" && (
                <>
                  <h2 className="text-2xl font-black">暫停中</h2>
                  <p className="mt-2 text-sm text-ink-soft">目前 {score} 分，準備好再繼續吧！</p>
                  <GameButton onClick={() => setStatus("playing")}>繼續遊戲</GameButton>
                </>
              )}
              {status === "over" && (
                <>
                  <p className="text-sm font-semibold tracking-[0.2em] text-mango-600 uppercase">Game Over</p>
                  <h2 className="mt-2 text-2xl font-black">{name ? `${name}，` : ""}你拿到了</h2>
                  <p className="mt-2 text-6xl font-black text-mango-600 tabular-nums">{score}</p>
                  <p className="mt-1 text-sm text-ink-soft">分</p>
                  <p className="mt-4 text-sm">
                    {newBest ? (
                      <span className="rounded-full bg-mango-100 px-3 py-1 font-semibold text-mango-700">🎉 新紀錄！</span>
                    ) : (
                      <span className="text-ink-soft">最高紀錄 {best} 分</span>
                    )}
                  </p>
                  <GameButton onClick={start}>再玩一次</GameButton>
                  <Link href="/#varieties" className="mt-3 inline-block text-sm font-semibold text-mango-600 underline-offset-4 hover:underline">
                    玩累了？去買真的芒果 →
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GameButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus
      className="btn-shine relative mt-6 w-full overflow-hidden rounded-full bg-linear-to-br from-mango-400 to-mango-600 py-3 font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)] transition-[scale,box-shadow] duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:shadow-[0_14px_30px_-8px_rgba(234,88,12,0.65)] active:scale-[0.98] active:duration-100"
    >
      {children}
    </button>
  );
}

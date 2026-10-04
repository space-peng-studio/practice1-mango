"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useVisitorName } from "@/lib/visitorName";

/** 中獎機率：0.3 = 30% */
const WIN_RATE = 0.3;

type Phase = "idle" | "drawing" | "win" | "lose";

function makeCouponCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = crypto.getRandomValues(new Uint32Array(4));
  return "MANGO90-" + Array.from(random, (n) => chars[n % chars.length]).join("");
}

export function LuckyDraw() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const name = useVisitorName();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const open = () => {
    setPhase("idle");
    setCopied(false);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  // 不限次數，每次都是獨立的機率
  const draw = () => {
    if (phase === "drawing") return;
    setPhase("drawing");
    setCopied(false);
    const won = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 < WIN_RATE;
    setTimeout(() => {
      if (won) setCoupon(makeCouponCode());
      setPhase(won ? "win" : "lose");
    }, 1600);
  };

  const copy = async () => {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon);
      setCopied(true);
    } catch {}
  };

  // 關閉時（含按 Esc）中止抽獎動畫狀態
  useEffect(() => {
    const dialog = dialogRef.current;
    const onClose = () => setPhase((p) => (p === "drawing" ? "idle" : p));
    dialog?.addEventListener("close", onClose);
    return () => dialog?.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      {/* 右下角浮動按鈕 */}
      <button
        type="button"
        onClick={open}
        className="glass-strong group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full py-2 pr-5 pl-2 font-semibold transition-[translate,scale,box-shadow] duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-10px_rgba(234,88,12,0.45)] active:scale-[0.98] active:duration-100 sm:right-6 sm:bottom-6"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-linear-to-br from-mango-400 to-orange-600 text-xl shadow-md transition-transform duration-300 group-hover:-rotate-12">
          <span className="absolute inset-0 animate-ping rounded-full bg-mango-400/50 [animation-duration:2.4s]" />
          <span className="relative">🎁</span>
        </span>
        <span className="text-sm">
          抽芒果 <span className="text-mango-600">9 折券</span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="lucky-title"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[min(92vw,26rem)] overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/30 backdrop:backdrop-blur-sm open:animate-pop-in"
      >
        <div className="glass-strong relative isolate overflow-hidden rounded-[2rem] px-6 pt-10 pb-7 text-center sm:px-8">
          <div aria-hidden="true" className="absolute -top-20 left-1/2 -z-10 size-64 -translate-x-1/2 rounded-full bg-mango-300/60 blur-3xl" />

          <button
            type="button"
            onClick={close}
            aria-label="關閉"
            className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white/70 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          <p className="text-sm font-semibold tracking-[0.2em] text-mango-600 uppercase">Lucky Mango</p>
          <h2 id="lucky-title" className="mt-2 text-2xl font-black sm:text-3xl">
            {phase === "win" ? `恭喜${name ?? ""}中獎！` : phase === "lose" ? "差一點點！" : "芒果幸運抽"}
          </h2>

          {/* 芒果 / 優惠券 */}
          <div className="relative mx-auto mt-6 grid h-44 place-items-center">
            {phase === "win" && coupon ? (
              <>
                <Confetti />
                <div className="animate-pop-in relative w-full rounded-2xl border-2 border-dashed border-mango-400 bg-linear-to-br from-mango-50 to-mango-100 px-5 py-5">
                  <p className="text-xs font-semibold text-mango-700">金芒園 全品項</p>
                  <p className="mt-1 text-5xl font-black text-mango-600">
                    9<span className="text-2xl"> 折</span>
                  </p>
                  <button
                    type="button"
                    onClick={copy}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 font-mono text-sm font-semibold tracking-wider shadow-sm transition-[scale,background-color] hover:bg-white active:scale-[0.98]"
                  >
                    {coupon}
                    <span className="font-sans text-xs text-mango-600">{copied ? "已複製 ✓" : "複製"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div
                key={phase}
                className={`relative size-36 ${phase === "drawing" ? "animate-shake" : "animate-float"} ${
                  phase === "lose" ? "opacity-60 grayscale-[40%]" : ""
                }`}
              >
                <Image
                  src="/images/cutout/mango-hero.png"
                  alt=""
                  fill
                  sizes="144px"
                  className="object-contain drop-shadow-[0_16px_20px_rgba(183,71,9,0.35)]"
                />
              </div>
            )}
          </div>

          <p className="mt-5 min-h-12 text-sm leading-relaxed text-ink-soft" aria-live="polite">
            {phase === "idle" && "搖一搖芒果，有機會抽中全品項 9 折優惠券！"}
            {phase === "drawing" && "芒果搖啊搖⋯⋯"}
            {phase === "lose" && "這次沒中，別灰心，再抽一次試試手氣！"}
            {phase === "win" && "明年開賣後，結帳時輸入優惠碼即可使用，記得先複製起來喔。"}
          </p>

          <div className="mt-5">
            {phase === "win" ? (
              <button
                type="button"
                onClick={() => {
                  close();
                  document.getElementById("varieties")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-shine relative w-full overflow-hidden rounded-full bg-linear-to-br from-mango-400 to-mango-600 py-3 font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)] transition-[scale,box-shadow] duration-300 active:scale-[0.98]"
              >
                去逛逛芒果
              </button>
            ) : (
              <button
                type="button"
                onClick={draw}
                disabled={phase === "drawing"}
                className="btn-shine relative w-full overflow-hidden rounded-full bg-linear-to-br from-mango-400 to-mango-600 py-3 font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)] transition-[scale,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:shadow-[0_14px_30px_-8px_rgba(234,88,12,0.65)] active:scale-[0.98] active:duration-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {phase === "drawing" ? "抽獎中⋯" : phase === "lose" ? "再抽一次" : "開始抽獎"}
              </button>
            )}
            {phase === "win" ? (
              <button
                type="button"
                onClick={draw}
                className="mt-3 text-sm font-semibold text-mango-600 underline-offset-4 hover:underline"
              >
                再抽一次
              </button>
            ) : (
              <p className="mt-3 text-xs text-ink-soft">
                不限次數 · 中獎機率 {Math.round(WIN_RATE * 100)}%
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

const confettiColors = ["#ffab1f", "#f98b0b", "#4c9a2a", "#ffd98a", "#e2342b"];

function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2">
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const distance = 110 + (i % 4) * 25;
        const style = {
          "--x": `${Math.cos(angle) * distance}px`,
          "--y": `${Math.sin(angle) * distance - 40}px`,
          "--r": `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg`,
          background: confettiColors[i % confettiColors.length],
          animationDelay: `${(i % 3) * 60}ms`,
        } as CSSProperties;
        return (
          <span
            key={i}
            style={style}
            className={`absolute animate-confetti ${i % 3 === 0 ? "size-2 rounded-full" : "h-3 w-1.5 rounded-sm"}`}
          />
        );
      })}
    </div>
  );
}

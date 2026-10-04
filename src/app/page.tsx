import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Greeting } from "@/components/Greeting";
import { LuckyDraw } from "@/components/LuckyDraw";
import { NotifyForm } from "@/components/NotifyForm";
import { Mango } from "@/components/Mango";
import { Navbar } from "@/components/Navbar";
import { ScrollEffects } from "@/components/ScrollEffects";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const stats = [
  { value: "16°+", label: "平均糖度 Brix" },
  { value: "24h", label: "採收到出貨" },
  { value: "4.9", label: "顧客好評" },
];

const features: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "sun",
    title: "樹上自然熟成",
    desc: "不催熟、不提早採收，等果實在枝頭吸飽陽光，香氣與甜度才會到位。",
  },
  {
    icon: "check",
    title: "人工逐顆分級",
    desc: "每顆都經過重量、外觀與糖度檢測，只把最好的那一批送到你手上。",
  },
  {
    icon: "snow",
    title: "全程冷鏈配送",
    desc: "包裝後直接進冷藏車，從產地到你家維持最佳溫度，熟度剛剛好。",
  },
  {
    icon: "truck",
    title: "產地直送到府",
    desc: "沒有中盤、沒有倉儲堆放，清晨採收、隔日抵達，新鮮看得見。",
  },
];

const varieties: {
  id: string;
  name: string;
  en: string;
  tag: string;
  desc: string;
  colors: [string, string, string];
  /** 去背照片；沒有的話用插圖 */
  image?: string;
  specs: [string, string][];
  price: string;
  unit: string;
  featured?: boolean;
}[] = [
  {
    id: "irwin",
    name: "愛文芒果",
    en: "Irwin",
    tag: "經典香甜",
    desc: "果肉細緻無纖維，濃郁蜜香，台灣夏天最具代表性的味道。",
    colors: ["#ffd34e", "#ff8a1c", "#e2342b"],
    image: "/images/cutout/irwin.png",
    specs: [
      ["糖度", "15–17°"],
      ["產季", "6–7 月"],
    ],
    price: "1,080",
    unit: "5 斤禮盒",
    featured: true,
  },
  {
    id: "jinhuang",
    name: "金煌芒果",
    en: "King Jin Huang",
    tag: "大顆多汁",
    desc: "單顆可達一斤以上，果肉厚實、汁多爽口，適合全家分享。",
    colors: ["#ffe98a", "#f9b417", "#c98a12"],
    image: "/images/cutout/jinhuang.png",
    specs: [
      ["糖度", "14–16°"],
      ["產季", "7–8 月"],
    ],
    price: "980",
    unit: "10 斤箱",
  },
  {
    id: "keitt",
    name: "凱特芒果",
    en: "Keitt",
    tag: "晚熟清爽",
    desc: "青皮也能吃，酸甜平衡、口感清爽，是產季尾聲的驚喜。",
    colors: ["#e3f08a", "#8cc63f", "#3b7d20"],
    image: "/images/cutout/keitt.png",
    specs: [
      ["糖度", "13–15°"],
      ["產季", "8–9 月"],
    ],
    price: "1,180",
    unit: "10 斤箱",
  },
  {
    id: "dried",
    name: "日曬芒果乾",
    en: "Dried Mango",
    tag: "全年供應",
    desc: "嚴選愛文低溫烘乾，無添加糖，保留果肉原本的香甜與 Q 度。",
    colors: ["#ffc96b", "#f08a24", "#b8501a"],
    specs: [
      ["添加糖", "無"],
      ["供應", "全年"],
    ],
    price: "450",
    unit: "200g × 3 包",
  },
];

const steps = [
  { no: "01", title: "清晨採收", desc: "趁天亮前氣溫低時採收，鎖住果實水分與香氣。" },
  { no: "02", title: "逐顆分級", desc: "依重量、外觀、糖度分級，瑕疵果另作加工。" },
  { no: "03", title: "冷鏈包裝", desc: "獨立網套與緩衝紙盒，防止碰撞與悶熟。" },
  { no: "04", title: "隔日到府", desc: "冷藏宅配直送，打開就是剛好入口的熟度。" },
];

const reviews = [
  {
    name: "林小姐",
    city: "台北",
    text: "打開箱子整個房間都是芒果香，切開完全沒有纖維，小孩一口接一口停不下來。",
  },
  {
    name: "陳先生",
    city: "新竹",
    text: "送長輩的禮盒，每一顆大小都很平均，包裝也很用心，今年已經回購第三次。",
  },
  {
    name: "Amy",
    city: "高雄",
    text: "以前買市場的常常放到爛還不甜，這家熟度抓得剛好，冰過之後做芒果冰超讚！",
  },
];

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <Navbar />

      <main className="overflow-x-clip">
        <Hero />
        <Features />
        <Varieties />
        <Story />
        <Reviews />
        <Order />
      </main>

      <Footer />
      <LuckyDraw />
    </>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section
      id="top"
      data-parallax-root
      className="relative isolate pt-32 pb-20 sm:pt-40 lg:min-h-svh lg:pb-28"
    >
      {/* 視差背景光暈 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-speed="0.25" className="absolute -top-32 -left-24 size-[26rem] rounded-full bg-mango-300/50 blur-3xl" />
        <div data-speed="0.4" className="absolute top-24 -right-32 size-[30rem] rounded-full bg-orange-300/40 blur-3xl" />
        <div data-speed="0.12" className="absolute bottom-0 left-1/3 size-80 rounded-full bg-leaf-400/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div className="text-center lg:text-left">
          <Greeting />
          <p
            className="glass inline-flex animate-fade-up items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-ink-soft"
          >
            <span className="size-2 rounded-full bg-leaf-500 shadow-[0_0_0_4px_rgba(76,154,42,0.2)]" />
            2026 產季已結束 · 2027 年 6 月開賣
          </p>

          <h1
            className="mt-6 animate-fade-up text-5xl leading-[1.1] font-black tracking-tight text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            一口咬下，
            <br />
            整個
            <span className="bg-linear-to-r from-mango-500 to-orange-600 bg-clip-text text-transparent">
              夏天
            </span>
            。
          </h1>

          <p
            className="mx-auto mt-6 max-w-lg animate-fade-up text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0"
            style={{ animationDelay: "200ms" }}
          >
            來自台南玉井的愛文芒果，在樹上自然熟成，清晨採收、冷鏈直送。不用等，打開箱子就是剛好的甜。
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-wrap justify-center gap-3 lg:justify-start"
            style={{ animationDelay: "300ms" }}
          >
            <Button href="#order" arrow>
              開賣通知我
            </Button>
            <Button href="#varieties" variant="ghost">
              看看有哪些品種
            </Button>
          </div>

          <dl
            className="mx-auto mt-12 grid max-w-md animate-fade-up grid-cols-3 gap-3 lg:mx-0"
            style={{ animationDelay: "400ms" }}
          >
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-3 py-4 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold text-mango-600 sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-xs text-ink-soft">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 主視覺：芒果 + 漂浮玻璃標籤 */}
        <div
          className="relative mx-auto aspect-square w-full max-w-md animate-fade-up lg:max-w-none"
          style={{ animationDelay: "200ms" }}
        >
          <div className="glass absolute inset-[8%] rounded-full" />
          <div className="absolute inset-[18%] rounded-full bg-linear-to-br from-mango-200/70 to-orange-300/50 blur-2xl" />

          <div data-speed="-0.12" className="absolute inset-[12%]">
            <div className="relative h-full w-full animate-float">
              <Image
                src="/images/cutout/mango-hero.png"
                alt="台南玉井愛文芒果"
                fill
                preload
                sizes="(min-width: 1024px) 420px, 76vw"
                className="object-contain drop-shadow-[0_30px_40px_rgba(183,71,9,0.35)]"
              />
            </div>
          </div>

          <div data-speed="0.18" className="absolute top-[10%] -left-2 sm:left-0">
            <div className="glass-strong animate-float-slow rounded-2xl px-4 py-3">
              <p className="text-xs text-ink-soft">今日糖度</p>
              <p className="text-xl font-bold text-mango-600">16.8° Brix</p>
            </div>
          </div>

          <div data-speed="-0.25" className="absolute -right-2 bottom-[12%] sm:right-0">
            <div className="glass-strong flex animate-float items-center gap-3 rounded-2xl px-4 py-3 [animation-delay:-3s]">
              <span className="grid size-9 place-items-center rounded-full bg-leaf-500/15 text-leaf-600">
                <Icon name="sun" className="size-5" />
              </span>
              <div>
                <p className="text-xs text-ink-soft">今晨 05:30</p>
                <p className="font-semibold">剛從樹上摘下</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 特色 ---------------- */

function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why 金芒園"
          title="好芒果，是等出來的"
          desc="我們只做一件事：讓你吃到芒果最好吃的那一刻。"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <article
              key={f.title}
              data-reveal
              style={delay(i * 100)}
              className="press glass group rounded-3xl p-6 transition-[translate,box-shadow,background-color] duration-500 hover:-translate-y-1.5 hover:bg-white/60 hover:shadow-[0_24px_48px_-20px_rgba(183,71,9,0.35)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-mango-300 to-mango-500 text-white shadow-[0_8px_16px_-6px_rgba(249,139,11,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <Icon name={f.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 品種 ---------------- */

function Varieties() {
  return (
    <section id="varieties" className="relative isolate scroll-mt-24 py-20 sm:py-28">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/4 -z-10 mx-auto h-96 max-w-4xl rounded-full bg-mango-200/40 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Varieties"
          title="跟著產季，吃遍三種好味道"
          desc="從六月的愛文到九月的凱特，每個月都有最當令的那一顆。"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {varieties.map((v, i) => (
            <article
              key={v.id}
              data-reveal
              style={delay(i * 100)}
              className={`press group relative flex flex-col rounded-3xl p-5 transition-[translate,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_28px_56px_-24px_rgba(183,71,9,0.4)] ${
                v.featured ? "glass-strong ring-2 ring-mango-400/60" : "glass"
              }`}
            >
              {v.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-mango-500 to-orange-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                  人氣首選
                </span>
              )}

              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-linear-to-br from-white/70 to-mango-100/60">
                {v.image ? (
                  <div className="relative h-4/5 w-4/5 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:-rotate-6">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 40vw, 80vw"
                      className="object-contain drop-shadow-[0_16px_20px_rgba(183,71,9,0.25)]"
                    />
                  </div>
                ) : (
                  <Mango
                    id={v.id}
                    colors={v.colors}
                    className="h-4/5 drop-shadow-[0_16px_20px_rgba(183,71,9,0.25)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:-rotate-6"
                  />
                )}
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-2">
                <h3 className="text-xl font-bold">{v.name}</h3>
                <span className="rounded-full bg-mango-100 px-2.5 py-0.5 text-xs font-semibold text-mango-700">
                  {v.tag}
                </span>
              </div>
              <p className="text-xs tracking-wider text-ink-soft/80 uppercase">{v.en}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{v.desc}</p>

              <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
                {v.specs.map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white/50 py-2">
                    <dt className="text-[11px] text-ink-soft">{label}</dt>
                    <dd className="text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-end justify-between gap-2">
                <p>
                  <span className="text-xs text-ink-soft">NT$ </span>
                  <span className="text-2xl font-bold text-mango-600">{v.price}</span>
                  <span className="block text-xs text-ink-soft">{v.unit}</span>
                </p>
                <Button href="#order" size="sm" variant={v.featured ? "primary" : "ghost"}>
                  通知我
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 產地故事（視差區塊） ---------------- */

function Story() {
  return (
    <section id="story" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div
        data-parallax-root
        className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-linear-to-br from-mango-400 via-mango-500 to-orange-600 px-6 py-16 sm:px-12 sm:py-20"
      >
        {/* 視差裝飾 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div data-speed="0.3" className="absolute -top-20 -right-16 size-80 rounded-full bg-mango-200/40 blur-3xl" />
          <div data-speed="-0.2" className="absolute -bottom-24 -left-10 size-96 rounded-full bg-orange-700/30 blur-3xl" />
          <div data-speed="-0.35" className="absolute top-10 right-[6%] hidden w-40 opacity-90 md:block lg:w-52">
            <Image
              src="/images/cutout/jinhuang.png"
              alt=""
              width={918}
              height={918}
              sizes="208px"
              className="w-full rotate-12 drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="max-w-xl text-white" data-reveal>
          <p className="text-sm font-semibold tracking-[0.2em] text-white/80 uppercase">Our Story</p>
          <h2 className="mt-3 text-3xl leading-tight font-black sm:text-5xl">
            從玉井的陽光開始
          </h2>
          <p className="mt-5 leading-relaxed text-white/90 sm:text-lg">
            玉井被稱為「芒果之鄉」，日夜溫差大、日照充足。我們家三代都在這片山坡種芒果，比起產量，更在意每一顆被吃下去的那一刻。
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.no}
              data-reveal
              style={delay(i * 120)}
              className="press rounded-3xl border border-white/40 bg-white/15 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_-12px_rgba(120,40,0,0.4)] backdrop-blur-xl transition-[translate,background-color] duration-500 hover:-translate-y-1 hover:bg-white/25"
            >
              <span className="text-3xl font-black text-white/50">{s.no}</span>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/85">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- 好評 ---------------- */

function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Reviews" title="吃過的人都說" desc="每一則評價，都是我們明年繼續努力的理由。" />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              data-reveal
              style={delay(i * 100)}
              className="press glass flex flex-col rounded-3xl p-6 transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgba(183,71,9,0.35)]"
            >
              <div className="flex gap-0.5 text-mango-500" aria-label="5 顆星">
                {Array.from({ length: 5 }, (_, n) => (
                  <svg key={n} viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed">「{r.text}」</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-mango-200 to-mango-400 font-bold text-white">
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <span className="text-xs text-ink-soft">{r.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 開賣通知（非產季） ---------------- */

function Order() {
  return (
    <section id="order" data-parallax-root className="relative isolate scroll-mt-24 px-4 py-20 sm:px-6 sm:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-speed="0.2" className="absolute top-0 left-[10%] size-72 rounded-full bg-mango-300/50 blur-3xl" />
        <div data-speed="-0.15" className="absolute right-[8%] bottom-0 size-80 rounded-full bg-orange-300/40 blur-3xl" />
      </div>

      <div
        data-reveal
        className="glass-strong mx-auto grid max-w-5xl items-center gap-10 rounded-[2.5rem] px-6 py-12 sm:px-12 md:grid-cols-[1fr_auto]"
      >
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-mango-100 px-3 py-1 text-xs font-semibold text-mango-700">
            <span className="size-1.5 rounded-full bg-mango-500" />
            目前非產季 · 暫停訂購
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-black sm:text-4xl">
            今年的芒果賣完了，
            <br className="hidden sm:block" />
            明年夏天見！
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            2027 年產季預計 6 月開賣。留下 Email，開賣第一時間通知你，不用一直回來看。
          </p>
          <div className="mt-6 md:max-w-md">
            <NotifyForm />
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft md:justify-start">
            {["開賣第一時間通知", "只寄開賣消息，不打擾"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Icon name="check" className="size-4 text-leaf-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-40 sm:w-52">
          <div className="animate-float">
            <Image
              src="/images/cutout/irwin.png"
              alt="愛文芒果"
              width={824}
              height={824}
              sizes="208px"
              className="w-full drop-shadow-[0_24px_30px_rgba(183,71,9,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 共用 ---------------- */

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: ReactNode }) {
  return (
    <div data-reveal className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-[0.2em] text-mango-600 uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-balance sm:text-4xl">{title}</h2>
      <p className="mt-4 text-ink-soft sm:text-lg">{desc}</p>
    </div>
  );
}

type IconName = "sun" | "check" | "snow" | "truck";

function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12.5 2.7 2.7L16.5 9.5" />
      </>
    ),
    snow: <path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />,
    truck: (
      <>
        <path d="M2.5 6.5h11v9h-11zM13.5 10h4l3 3v2.5h-7z" />
        <circle cx="6.5" cy="17.5" r="1.8" />
        <circle cx="16.5" cy="17.5" r="1.8" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

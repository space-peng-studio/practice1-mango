import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { MangoCatchGame } from "@/components/MangoCatchGame";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "接芒果大挑戰｜金芒園",
  description: "移動籃子接住掉下來的芒果，看看你能拿到幾分！",
};

export default function GamePage() {
  return (
    <>
      <Navbar />

      <main className="relative isolate flex-1 overflow-x-clip pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-24 size-[26rem] rounded-full bg-mango-300/40 blur-3xl" />
          <div className="absolute top-60 -right-32 size-[30rem] rounded-full bg-orange-300/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="mb-8 animate-fade-up text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-mango-600 uppercase">Mini Game</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">接芒果大挑戰</h1>
            <p className="mt-3 text-ink-soft">芒果從樹上掉下來了！快拿籃子接住，小心別接到蟲。</p>
          </header>

          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <MangoCatchGame />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

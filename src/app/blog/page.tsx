import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollEffects } from "@/components/ScrollEffects";
import { formatDate, posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "種植日記｜金芒園",
  description: "從開花、套袋到凌晨的採收，記錄玉井果園一整年種芒果的故事。",
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function BlogPage() {
  return (
    <>
      <ScrollEffects />
      <Navbar />

      <main className="relative isolate flex-1 overflow-x-clip pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-24 size-[26rem] rounded-full bg-mango-300/40 blur-3xl" />
          <div className="absolute top-60 -right-32 size-[30rem] rounded-full bg-orange-300/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <header className="mx-auto max-w-2xl animate-fade-up text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-mango-600 uppercase">Orchard Diary</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">種植日記</h1>
            <p className="mt-4 text-ink-soft sm:text-lg">
              一顆芒果從開花到你手上，要走將近半年。這裡記下果園裡一整年的故事。
            </p>
          </header>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <article
                key={post.slug}
                data-reveal
                style={delay(i * 100)}
                className="press glass group relative flex flex-col overflow-hidden rounded-3xl transition-[translate,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_28px_56px_-24px_rgba(183,71,9,0.4)]"
              >
                <div className={`relative grid aspect-[4/3] place-items-center bg-linear-to-br ${post.coverBg}`}>
                  <div className="relative h-3/4 w-3/4 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:-rotate-6">
                    <Image
                      src={post.cover}
                      alt=""
                      fill
                      loading={i === 0 ? "eager" : "lazy"}
                      sizes="(min-width: 768px) 260px, 70vw"
                      className="object-contain drop-shadow-[0_16px_20px_rgba(183,71,9,0.25)]"
                    />
                  </div>
                  <span className="glass-strong absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-mango-700">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-ink-soft">
                    <time dateTime={post.date}>{formatDate(post.date)}</time> · 閱讀約 {post.readMinutes} 分鐘
                  </p>
                  <h2 className="mt-2 text-xl leading-snug font-bold">
                    {/* 整張卡片都可點：連結的 ::after 蓋滿卡片 */}
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mango-600">
                    閱讀全文
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

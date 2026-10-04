import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollEffects } from "@/components/ScrollEffects";
import { formatDate, getPost, posts } from "@/data/posts";

// 只有這三篇，其他網址直接 404
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title}｜金芒園種植日記`, description: post.excerpt };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.indexOf(post);
  const prev = posts[index - 1];
  const next = posts[index + 1];

  return (
    <>
      {/* key：換文章時重新掃描進場動畫的元素 */}
      <ScrollEffects key={slug} />
      <Navbar />

      <main className="relative isolate flex-1 overflow-x-clip pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 size-[26rem] rounded-full bg-mango-300/40 blur-3xl" />
          <div className="absolute top-[40rem] -left-32 size-[28rem] rounded-full bg-orange-300/25 blur-3xl" />
        </div>

        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-ink"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <path d="M16 10H4m5 5-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            所有日記
          </Link>

          <header className="mt-6 animate-fade-up">
            <span className="rounded-full bg-mango-100 px-3 py-1 text-xs font-semibold text-mango-700">
              {post.category}
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight text-balance sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-ink-soft">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · 閱讀約 {post.readMinutes} 分鐘
            </p>
          </header>

          <div
            className={`relative mt-8 grid aspect-[16/9] border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_-12px_rgba(146,64,14,0.18)] animate-fade-up place-items-center overflow-hidden rounded-[2rem] bg-linear-to-br ${post.coverBg}`}
            style={{ animationDelay: "120ms" }}
          >
            <div className="relative h-3/4 w-1/2 animate-float">
              <Image
                src={post.cover}
                alt=""
                fill
                preload
                sizes="(min-width: 768px) 360px, 50vw"
                className="object-contain drop-shadow-[0_24px_30px_rgba(183,71,9,0.3)]"
              />
            </div>
          </div>

          <div className="glass mt-8 rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
            <p className="text-lg leading-relaxed font-medium sm:text-xl">{post.excerpt}</p>
            {post.sections.map((section, i) => (
              <section key={i} data-reveal className="mt-8">
                {section.heading && (
                  <h2 className="mb-3 flex items-center gap-3 text-xl font-bold sm:text-2xl">
                    <span className="h-6 w-1.5 rounded-full bg-linear-to-b from-mango-400 to-orange-600" />
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="mt-4 leading-[1.9] text-ink/90 first:mt-0 sm:text-lg">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* 文章結尾導購 */}
          <div
            data-reveal
            className="glass-strong mt-8 flex flex-col items-center gap-4 rounded-[2rem] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <div>
              <p className="text-lg font-bold">想嚐嚐故事裡的芒果嗎？</p>
              <p className="mt-1 text-sm text-ink-soft">今年產季已結束，2027 年 6 月開賣，先登記通知吧。</p>
            </div>
            <Button href="/#order" arrow className="shrink-0">
              開賣通知我
            </Button>
          </div>

          {/* 上一篇 / 下一篇 */}
          <nav aria-label="其他日記" className="mt-10 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <PostLink post={prev} label="上一篇" />
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && <PostLink post={next} label="下一篇" alignRight />}
          </nav>
        </article>
      </main>

      <Footer />
    </>
  );
}

function PostLink({
  post,
  label,
  alignRight = false,
}: {
  post: (typeof posts)[number];
  label: string;
  alignRight?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`press glass rounded-3xl p-5 transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(183,71,9,0.35)] ${
        alignRight ? "sm:text-right" : ""
      }`}
    >
      <span className="text-xs text-ink-soft">{label}</span>
      <span className="mt-1 block font-bold">{post.title}</span>
    </Link>
  );
}

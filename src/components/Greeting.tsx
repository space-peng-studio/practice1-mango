"use client";

import { requestNameEdit, useVisitorName } from "@/lib/visitorName";

/** 首頁的歡迎詞：有稱呼才顯示 */
export function Greeting() {
  const name = useVisitorName();
  if (!name) return null;

  return (
    <p className="mb-4 flex animate-fade-up flex-wrap items-center justify-center gap-x-2 gap-y-1 text-lg font-semibold lg:justify-start">
      <span>
        👋 嗨，<span className="text-mango-600">{name}</span>，歡迎來到金芒園！
      </span>
      <button
        type="button"
        onClick={requestNameEdit}
        className="rounded-full px-2.5 py-0.5 text-xs font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-ink"
      >
        改稱呼
      </button>
    </p>
  );
}

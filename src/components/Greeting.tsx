"use client";

import { requestNameEdit, useVisitorName } from "@/lib/visitorName";

/** 首頁的歡迎詞；沒有稱呼（之前略過）時，提供輸入的按鈕 */
export function Greeting() {
  const name = useVisitorName();

  return (
    <p className="mb-4 flex animate-fade-up flex-wrap items-center justify-center gap-x-2 gap-y-1 text-lg font-semibold lg:justify-start">
      <span>
        👋 嗨{name && <>，<span className="text-mango-600">{name}</span></>}，歡迎來到金芒園！
      </span>
      <button
        type="button"
        onClick={requestNameEdit}
        className="rounded-full px-2.5 py-0.5 text-xs font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-ink"
      >
        {name ? "改稱呼" : "輸入稱呼"}
      </button>
    </p>
  );
}

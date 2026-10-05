"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  NAME_MAX_LENGTH,
  onNameEditRequest,
  readVisitorName,
  setVisitorName,
} from "@/lib/visitorName";

const SKIP_KEY = "mango-visitor-skipped";

/** 第一次進站時詢問稱呼；略過的話，這次瀏覽就不再問 */
export function WelcomePrompt() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let skipped = false;
    try {
      skipped = sessionStorage.getItem(SKIP_KEY) === "1";
    } catch {}
    if (!readVisitorName() && !skipped) dialogRef.current?.showModal();

    return onNameEditRequest(() => {
      setValue(readVisitorName() ?? "");
      setEditing(true);
      dialogRef.current?.showModal();
    });
  }, []);

  const skip = () => {
    try {
      sessionStorage.setItem(SKIP_KEY, "1");
    } catch {}
    dialogRef.current?.close();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = value.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    setVisitorName(name);
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="welcome-title"
      // 按 Esc 等同略過
      onCancel={skip}
      onClose={() => setEditing(false)}
      className="m-auto w-[min(92vw,24rem)] overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/30 backdrop:backdrop-blur-sm open:animate-pop-in"
    >
      <form
        onSubmit={submit}
        className="glass-strong relative isolate overflow-hidden rounded-[2rem] px-6 pt-8 pb-6 text-center sm:px-8"
      >
        <div aria-hidden="true" className="absolute -top-20 left-1/2 -z-10 size-64 -translate-x-1/2 rounded-full bg-mango-300/60 blur-3xl" />

        <div className="relative mx-auto size-24 animate-float">
          <Image
            src="/images/cutout/mango-hero.png"
            alt=""
            fill
            sizes="96px"
            className="object-contain drop-shadow-[0_12px_16px_rgba(183,71,9,0.35)]"
          />
        </div>

        <h2 id="welcome-title" className="mt-4 text-2xl font-black">
          {editing ? "修改稱呼" : "歡迎來到金芒園"}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">我們該怎麼稱呼你呢？</p>

        <label htmlFor="visitor-name" className="sr-only">
          你的稱呼
        </label>
        <input
          ref={inputRef}
          id="visitor-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={NAME_MAX_LENGTH}
          placeholder="例如：小芒、王小姐"
          autoComplete="nickname"
          autoFocus
          className="mt-5 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-center text-lg font-semibold shadow-[inset_0_1px_2px_rgba(146,64,14,0.08)] transition-shadow outline-none placeholder:font-normal placeholder:text-ink-soft/50 focus:shadow-[0_0_0_3px_rgba(249,139,11,0.35)]"
        />

        <button
          type="submit"
          className="btn-shine relative mt-4 w-full overflow-hidden rounded-full bg-linear-to-br from-mango-400 to-mango-600 py-3 font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)] transition-[scale,box-shadow] duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:shadow-[0_14px_30px_-8px_rgba(234,88,12,0.65)] active:scale-[0.98] active:duration-100"
        >
          {editing ? "儲存" : "開始逛逛"}
        </button>
        <button
          type="button"
          onClick={editing ? () => dialogRef.current?.close() : skip}
          className="mt-2 w-full rounded-full py-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          {editing ? "取消" : "先略過"}
        </button>
      </form>
    </dialog>
  );
}

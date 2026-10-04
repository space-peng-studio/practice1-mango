"use client";

import { useActionState } from "react";
import { subscribeLaunchNotice, type NotifyState } from "@/app/actions/notify";

const initialState: NotifyState = { status: "idle", message: "" };

export function NotifyForm() {
  const [state, formAction, pending] = useActionState(subscribeLaunchNotice, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="animate-pop-in flex items-start gap-3 rounded-2xl bg-leaf-500/10 px-5 py-4 text-left">
        <span className="text-2xl">💌</span>
        <div>
          <p className="font-bold text-leaf-600">{state.message}</p>
          <p className="mt-1 text-sm text-ink-soft">通知會寄到 {state.email}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="notify-email" className="sr-only">
          Email
        </label>
        <input
          id="notify-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="你的 Email"
          defaultValue={state.email}
          aria-invalid={state.status === "error"}
          aria-describedby="notify-message"
          className="min-w-0 flex-1 rounded-full border border-white/80 bg-white/70 px-5 py-3 shadow-[inset_0_1px_2px_rgba(146,64,14,0.08)] transition-shadow outline-none placeholder:text-ink-soft/60 focus:shadow-[0_0_0_3px_rgba(249,139,11,0.35)] aria-invalid:border-[#e2342b]/60"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-shine relative shrink-0 overflow-hidden rounded-full bg-linear-to-br from-mango-400 to-mango-600 px-6 py-3 font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)] transition-[scale,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:shadow-[0_14px_30px_-8px_rgba(234,88,12,0.65)] active:scale-[0.98] active:duration-100 disabled:opacity-60"
        >
          {pending ? "登記中⋯" : "開賣通知我"}
        </button>
      </div>
      <p id="notify-message" aria-live="polite" className="mt-2 min-h-5 px-2 text-sm text-[#e2342b]">
        {state.status === "error" && state.message}
      </p>
    </form>
  );
}

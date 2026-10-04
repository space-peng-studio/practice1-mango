"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Button";

const links = [
  { href: "/#features", label: "特色" },
  { href: "/#varieties", label: "品種" },
  { href: "/#story", label: "產地故事" },
  { href: "/#reviews", label: "好評" },
  { href: "/blog", label: "種植日記" },
  { href: "/game", label: "小遊戲" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // 首頁錨點（/#...）不算；/blog、/game 這類獨立頁面在該頁時要亮起來
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled ? "glass-strong" : "glass"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2 font-bold tracking-wide">
          <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-mango-300 to-mango-600 text-lg shadow-md transition-transform duration-300 group-hover:rotate-12">
            🥭
          </span>
          <span className="text-lg">金芒園</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-white/60 hover:text-ink ${
                  isActive(link.href) ? "bg-white/70 text-ink" : "text-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button href="/#order" size="sm" className="hidden sm:inline-flex">
            開賣通知
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "關閉選單" : "開啟選單"}
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/60 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 手機版下拉選單 */}
      <div
        className={`glass-strong mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-3">
          {[...links, { href: "/#order", label: "開賣通知" }].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block rounded-2xl px-4 py-3 font-medium transition-colors hover:bg-white/70 ${
                  isActive(link.href) ? "bg-white/70" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

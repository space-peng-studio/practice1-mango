"use client";

import { useEffect } from "react";

/**
 * 全頁共用的捲動效果（只掛一次）：
 * - [data-reveal]：進入畫面時加上 .is-visible，做淡入上移
 * - [data-speed]：依所屬 [data-parallax-root] 與視窗中心的距離位移，做視差
 *   speed > 0 比捲動慢（背景感），speed < 0 比捲動快（前景感）
 */
export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("fx");

    // iOS Safari 要有 touchstart 監聽，:active（點擊回饋）才會生效
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => observer.observe(el));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-speed]"),
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduceMotion.matches) {
        layers.forEach((el) => (el.style.transform = ""));
        return;
      }
      const vh = window.innerHeight;
      for (const el of layers) {
        const host =
          el.closest<HTMLElement>("[data-parallax-root]") ?? el.parentElement;
        if (!host) continue;
        const rect = host.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const offset = rect.top + rect.height / 2 - vh / 2;
        const speed = Number(el.dataset.speed) || 0;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduceMotion.addEventListener("change", schedule);

    return () => {
      document.removeEventListener("touchstart", noop);
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduceMotion.removeEventListener("change", schedule);
      root.classList.remove("fx");
    };
  }, []);

  return null;
}

import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-linear-to-br from-mango-400 to-mango-600 text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.55)] hover:shadow-[0_14px_30px_-8px_rgba(234,88,12,0.65)] active:shadow-[0_4px_10px_-4px_rgba(234,88,12,0.45)]",
  ghost: "glass text-ink hover:bg-white/75 active:bg-white/80",
};

const sizes = {
  md: "px-6 py-3 text-sm sm:text-base",
  sm: "px-4 py-2 text-sm",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`btn-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-[translate,scale,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mango-500 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {arrow && (
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
      )}
    </Link>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WelcomePrompt } from "@/components/WelcomePrompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "金芒園｜台南玉井芒果 產地直送",
  description:
    "樹上自然熟成的台南玉井愛文、金煌、凱特芒果，清晨採收、冷鏈配送，隔日送到你家。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <WelcomePrompt />
      </body>
    </html>
  );
}

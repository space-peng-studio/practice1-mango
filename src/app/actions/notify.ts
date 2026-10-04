"use server";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type NotifyState = {
  status: "idle" | "success" | "error";
  message: string;
  email?: string;
};

type Subscriber = { email: string; createdAt: string };

// 名單存在專案根目錄的 data/subscribers.json（已加進 .gitignore，不會被提交）
const FILE = path.join(process.cwd(), "data", "subscribers.json");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Subscriber[];
  } catch {
    return [];
  }
}

export async function subscribeLaunchNotice(_prev: NotifyState, formData: FormData): Promise<NotifyState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { status: "error", message: "Email 格式好像不太對，再檢查一下喔。", email };
  }

  const list = await readSubscribers();
  if (list.some((s) => s.email === email)) {
    return { status: "success", message: "這個 Email 已經登記過了，開賣時一定會通知你！", email };
  }

  list.push({ email, createdAt: new Date().toISOString() });
  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(list, null, 2));
  } catch {
    return { status: "error", message: "系統忙碌中，請稍後再試一次。", email };
  }

  return { status: "success", message: "登記成功！明年開賣時，我們會第一個通知你。", email };
}

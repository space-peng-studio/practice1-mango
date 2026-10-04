"use client";

import { useSyncExternalStore } from "react";

/**
 * 訪客稱呼：存在這個瀏覽器的 localStorage，
 * 任何元件用 useVisitorName() 讀取，改名後所有地方會一起更新。
 */
const STORAGE_KEY = "mango-visitor-name";
const CHANGE_EVENT = "visitor-name-change";
const EDIT_EVENT = "visitor-name-edit";

export const NAME_MAX_LENGTH = 12;

// localStorage 不能用時（例如無痕模式被封鎖）的備援
let memoryName: string | null = null;

export function readVisitorName() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memoryName;
  } catch {
    return memoryName;
  }
}

export function setVisitorName(name: string) {
  memoryName = name;
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // 其他分頁改名也同步
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useVisitorName() {
  // 伺服器端沒有 localStorage，先當作沒有名字
  return useSyncExternalStore(subscribe, readVisitorName, () => null);
}

/** 叫出「輸入稱呼」視窗（修改稱呼用） */
export function requestNameEdit() {
  window.dispatchEvent(new Event(EDIT_EVENT));
}

export function onNameEditRequest(callback: () => void) {
  window.addEventListener(EDIT_EVENT, callback);
  return () => window.removeEventListener(EDIT_EVENT, callback);
}

"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 存在 localStorage 的狀態（只存在這台瀏覽器）。
 * 用 useSyncExternalStore 讀取，伺服器端與第一次渲染都用預設值，避免 hydration 不一致。
 */
function createStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let cacheRaw: string | null | undefined;
  let cacheVal: T = fallback;

  function read(): T {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      // 私密模式或被封鎖時讀不到，就用預設值
    }
    if (raw !== cacheRaw) {
      cacheRaw = raw;
      try {
        if (raw === null) cacheVal = fallback;
        else if (Array.isArray(fallback)) cacheVal = JSON.parse(raw) as T;
        // 物件：和預設值合併，之後新增設定欄位也不會壞
        else cacheVal = { ...fallback, ...JSON.parse(raw) };
      } catch {
        cacheVal = fallback;
      }
    }
    return cacheVal;
  }

  function write(value: T) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 寫不進去就只保留在記憶體
      cacheRaw = JSON.stringify(value);
      cacheVal = value;
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { read, write, subscribe, fallback };
}

export type Store<T> = ReturnType<typeof createStore<T>>;

export function useStore<T>(store: Store<T>) {
  const value = useSyncExternalStore(
    store.subscribe,
    store.read,
    () => store.fallback,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = store.read();
      store.write(
        typeof next === "function" ? (next as (p: T) => T)(prev) : next,
      );
    },
    [store],
  );
  return [value, set] as const;
}

export type Settings = {
  work: number; // 分鐘
  short: number;
  long: number;
  longEvery: number; // 每幾個番茄後長休息
  autoStartBreak: boolean;
  autoStartWork: boolean;
  sound: boolean;
  notify: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  work: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  autoStartBreak: true,
  autoStartWork: false,
  sound: true,
  notify: false,
};

export type LogEntry = {
  date: string; // YYYY-MM-DD（本地時間）
  endedAt: number;
  task: string;
  minutes: number;
};

export const settingsStore = createStore<Settings>(
  "ed_tools.pomodoro.settings",
  DEFAULT_SETTINGS,
);

export const logStore = createStore<LogEntry[]>("ed_tools.pomodoro.log", []);

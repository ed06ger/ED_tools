"use client";

import { useEffect, useEffectEvent, useState } from "react";
import BackHome from "../_components/BackHome";
import {
  DEFAULT_SETTINGS,
  logStore,
  settingsStore,
  useStore,
  type Settings,
} from "./storage";

type Mode = "work" | "short" | "long";

const MODES: Record<
  Mode,
  { label: string; bg: string; accent: string; ring: string; hint: string }
> = {
  work: {
    label: "專注",
    bg: "bg-[#ba4949]",
    accent: "text-[#ba4949]",
    ring: "#fff",
    hint: "專注在一件事上，別分心！",
  },
  short: {
    label: "短休息",
    bg: "bg-[#38858a]",
    accent: "text-[#38858a]",
    ring: "#fff",
    hint: "起來走走、喝口水吧～",
  },
  long: {
    label: "長休息",
    bg: "bg-[#397097]",
    accent: "text-[#397097]",
    ring: "#fff",
    hint: "辛苦了，好好休息一下！",
  },
};

const RADIUS = 120;
const CIRC = 2 * Math.PI * RADIUS;

function fmt(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function localDate(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function clockTime(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** 用 Web Audio 播三聲「嗶」，不需要音效檔 */
function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      const t = ctx.currentTime + offset;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // 瀏覽器不支援就算了
  }
}

function notify(title: string, body: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch {
    // 忽略
  }
}

export default function Pomodoro() {
  const [settings, setSettings] = useStore(settingsStore);
  const [log, setLog] = useStore(logStore);

  const [mode, setMode] = useState<Mode>("work");
  const [running, setRunning] = useState(false);
  const [endAt, setEndAt] = useState(0); // 計時中：結束的時間戳
  const [paused, setPaused] = useState<number | null>(null); // 暫停時剩餘毫秒，null = 尚未開始
  const [now, setNow] = useState(0);
  const [round, setRound] = useState(1); // 這一輪第幾個番茄
  const [task, setTask] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [today, setToday] = useState("");

  const durationMs = (m: Mode, s: Settings = settings) => s[m] * 60_000;
  const remaining = running
    ? Math.max(0, endAt - now)
    : (paused ?? durationMs(mode));
  const progress = 1 - remaining / durationMs(mode);

  const todayLog = log.filter((e) => e.date === today);
  const todayMinutes = todayLog.reduce((sum, e) => sum + e.minutes, 0);

  function start() {
    const t = Date.now();
    setNow(t);
    setEndAt(t + remaining);
    setRunning(true);
  }

  function pause() {
    setPaused(Math.max(0, endAt - Date.now()));
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setPaused(null);
  }

  function switchMode(next: Mode, autoStart = false) {
    setMode(next);
    setPaused(null);
    if (autoStart) {
      const t = Date.now();
      setNow(t);
      setEndAt(t + durationMs(next));
      setRunning(true);
    } else {
      setRunning(false);
    }
  }

  /** 一段時間結束：記錄、提醒、切到下一個模式 */
  function complete(skipped: boolean) {
    if (mode === "work") {
      if (!skipped) {
        const t = Date.now();
        setLog((prev) => [
          ...prev,
          {
            date: localDate(t),
            endedAt: t,
            task: task.trim(),
            minutes: settings.work,
          },
        ]);
      }
      const isLong = round % settings.longEvery === 0;
      if (!skipped) {
        if (settings.sound) beep();
        if (settings.notify)
          notify("🍅 番茄完成！", isLong ? "來個長休息吧" : "休息一下吧");
      }
      switchMode(isLong ? "long" : "short", settings.autoStartBreak);
    } else {
      if (!skipped) {
        if (settings.sound) beep();
        if (settings.notify) notify("⏰ 休息結束", "回來專注囉！");
      }
      if (mode === "long") setRound(1);
      else setRound((r) => r + 1);
      switchMode("work", settings.autoStartWork);
    }
  }

  const onTick = useEffectEvent((t: number) => {
    setNow(t);
    if (t >= endAt) complete(false);
  });

  // 計時：每 250ms 更新一次，用結束時間戳計算（切到背景分頁也不會跑慢）
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => onTick(Date.now()), 250);
    return () => clearInterval(id);
  }, [running, endAt]);

  // 今天的日期（只在瀏覽器端算，避免伺服器時區不同）
  useEffect(() => {
    const update = () => setToday(localDate(Date.now()));
    const id = setTimeout(update, 0);
    const daily = setInterval(update, 60_000);
    return () => {
      clearTimeout(id);
      clearInterval(daily);
    };
  }, []);

  // 分頁標題顯示倒數
  useEffect(() => {
    const original = "番茄鐘 | ed_tools";
    document.title =
      running || paused !== null
        ? `${fmt(remaining)} · ${MODES[mode].label}${running ? "" : "（暫停）"}`
        : original;
    return () => {
      document.title = original;
    };
  }, [remaining, running, paused, mode]);

  // 空白鍵：開始 / 暫停
  const onSpace = useEffectEvent(() => (running ? pause() : start()));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, button")) return;
      if (e.code === "Space") {
        e.preventDefault();
        onSpace();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function toggleNotify(on: boolean) {
    if (
      on &&
      "Notification" in window &&
      Notification.permission !== "granted"
    ) {
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        alert("瀏覽器沒有允許通知，請到網址列左側的設定開啟。");
        return;
      }
    }
    setSettings((s) => ({ ...s, notify: on }));
  }

  function updateNumber(
    key: "work" | "short" | "long" | "longEvery",
    value: string,
  ) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return;
    const max = key === "longEvery" ? 12 : 180;
    setSettings((s) => ({ ...s, [key]: Math.min(max, Math.max(1, n)) }));
  }

  const theme = MODES[mode];

  return (
    <main
      className={`${theme.bg} flex-1 px-4 py-10 text-white transition-colors duration-700`}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8">
        <BackHome className="-mb-4 self-start border-white/40 text-white/90 hover:border-white hover:bg-white/15" />
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">🍅 番茄鐘</h1>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/30"
          >
            {showSettings ? "關閉設定" : "⚙️ 設定"}
          </button>
        </header>

        {showSettings && (
          <section className="w-full rounded-2xl bg-white p-5 text-neutral-800 shadow-lg">
            <h2 className="mb-4 font-bold">設定</h2>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ["work", "專注（分）"],
                  ["short", "短休息（分）"],
                  ["long", "長休息（分）"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex flex-col gap-1 text-xs text-neutral-500"
                >
                  {label}
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={settings[key]}
                    onChange={(e) => updateNumber(key, e.target.value)}
                    className="rounded-lg bg-neutral-100 px-3 py-2 text-base text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <label className="flex items-center justify-between gap-3">
                每幾個番茄後長休息
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={settings.longEvery}
                  onChange={(e) => updateNumber("longEvery", e.target.value)}
                  className="w-20 rounded-lg bg-neutral-100 px-3 py-1.5 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </label>
              {(
                [
                  ["autoStartBreak", "番茄結束後自動開始休息"],
                  ["autoStartWork", "休息結束後自動開始專注"],
                  ["sound", "時間到播放提示音"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-3"
                >
                  {label}
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, [key]: e.target.checked }))
                    }
                    className="h-5 w-5 accent-[#ba4949]"
                  />
                </label>
              ))}
              <label className="flex items-center justify-between gap-3">
                時間到顯示桌面通知
                <input
                  type="checkbox"
                  checked={settings.notify}
                  onChange={(e) => toggleNotify(e.target.checked)}
                  className="h-5 w-5 accent-[#ba4949]"
                />
              </label>
              <button
                type="button"
                onClick={() => setSettings(DEFAULT_SETTINGS)}
                className="self-start text-xs text-neutral-500 underline hover:text-neutral-800"
              >
                恢復預設值
              </button>
            </div>
          </section>
        )}

        {/* 模式切換 */}
        <nav className="flex gap-2 rounded-full bg-black/15 p-1">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                mode === m ? "bg-white/25" : "opacity-80 hover:bg-white/10"
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </nav>

        {/* 倒數圓環 */}
        <div className="relative aspect-square w-full max-w-[300px]">
          <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
            <circle
              cx={140}
              cy={140}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={12}
            />
            <circle
              cx={140}
              cy={140}
              r={RADIUS}
              fill="none"
              stroke={theme.ring}
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - Math.min(1, Math.max(0, progress)))}
              style={{ transition: "stroke-dashoffset 250ms linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-6xl font-bold tabular-nums sm:text-7xl">
              {fmt(remaining)}
            </div>
            <div className="mt-2 text-sm opacity-80">
              {mode === "work" ? `第 ${round} 個番茄` : theme.label}
            </div>
          </div>
        </div>

        {/* 控制按鈕 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={reset}
            disabled={!running && paused === null}
            aria-label="重設"
            title="重設"
            className="h-12 w-12 rounded-full bg-white/20 text-xl hover:bg-white/30 disabled:opacity-40"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={running ? pause : start}
            className={`h-16 w-44 rounded-2xl bg-white text-2xl font-bold tracking-widest shadow-[0_6px_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none ${theme.accent}`}
          >
            {running ? "暫停" : paused !== null ? "繼續" : "開始"}
          </button>
          <button
            type="button"
            onClick={() => complete(true)}
            aria-label="跳過"
            title="跳過，直接進入下一階段"
            className="h-12 w-12 rounded-full bg-white/20 text-xl hover:bg-white/30"
          >
            ⏭
          </button>
        </div>
        <p className="-mt-4 text-xs opacity-70">按空白鍵也可以開始 / 暫停</p>

        {/* 目前任務 */}
        <section className="w-full">
          <label className="flex flex-col gap-2">
            <span className="text-sm opacity-80">{theme.hint}</span>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="現在要專注做什麼？"
              className="w-full rounded-xl bg-white/15 px-4 py-3 text-lg placeholder:text-white/60 outline-none focus:bg-white/25"
            />
          </label>
        </section>

        {/* 今日紀錄 */}
        <section className="w-full rounded-2xl bg-black/15 p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-bold">今日成果</h2>
            <span className="text-sm opacity-80">
              🍅 × {todayLog.length}　共 {todayMinutes} 分鐘
            </span>
          </div>
          {todayLog.length === 0 ? (
            <p className="text-sm opacity-70">
              還沒有完成的番茄，開始第一個吧！
            </p>
          ) : (
            <ol className="flex flex-col gap-1.5 text-sm">
              {todayLog
                .slice()
                .reverse()
                .map((e) => (
                  <li
                    key={e.endedAt}
                    className="flex justify-between gap-3 rounded-lg bg-white/10 px-3 py-2"
                  >
                    <span className="truncate">
                      🍅 {e.task || "（未命名任務）"}
                    </span>
                    <span className="shrink-0 opacity-70">
                      {clockTime(e.endedAt)} · {e.minutes} 分
                    </span>
                  </li>
                ))}
            </ol>
          )}
          {todayLog.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("確定要清除今天的紀錄嗎？"))
                  setLog((prev) => prev.filter((e) => e.date !== today));
              }}
              className="mt-3 text-xs underline opacity-70 hover:opacity-100"
            >
              清除今日紀錄
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

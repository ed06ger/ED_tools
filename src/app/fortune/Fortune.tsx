"use client";

import { useEffect, useRef, useState } from "react";
import {
  LEVELS,
  drawFortune,
  toChineseNumber,
  type FortuneResult,
} from "./fortuneData";
import { signOf, type Sign } from "./zodiac";

type Phase = "ask" | "ready" | "shaking" | "popping" | "result";

const STICKS = [
  { left: 22, rot: -14, h: 84 },
  { left: 36, rot: -7, h: 96 },
  { left: 50, rot: -2, h: 88 },
  { left: 56, rot: 0, h: 104 }, // 會被抽出來的那支
  { left: 66, rot: 5, h: 92 },
  { left: 80, rot: 11, h: 86 },
  { left: 92, rot: 16, h: 80 },
];
const POP_INDEX = 3;

function Stars({ n }: { n: number }) {
  return (
    <span className="tracking-wider text-[#fbbf24]" aria-label={`${n} 顆星`}>
      {"★".repeat(n)}
      <span className="text-[#fbbf24]/25">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function todayText() {
  const d = new Date();
  const week = "日一二三四五六"[d.getDay()];
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（${week}）`;
}

export default function Fortune() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [birthday, setBirthday] = useState("");
  const [sign, setSign] = useState<Sign | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [drawnAt, setDrawnAt] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // 生日輸入時即時顯示星座
  const preview = (() => {
    const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(birthday);
    return m ? signOf(Number(m[1]), Number(m[2])) : null;
  })();

  function confirmBirthday(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) return;
    setSign(preview);
    setResult(null);
    setPhase("ready");
  }

  function shake() {
    if (!sign || phase === "shaking" || phase === "popping") return;
    timers.current.forEach(clearTimeout);
    setResult(drawFortune(sign));
    setDrawnAt(todayText());
    setPhase("shaking");
    timers.current = [
      setTimeout(() => setPhase("popping"), 1500),
      setTimeout(() => setPhase("result"), 2300),
    ];
  }

  function restart() {
    timers.current.forEach(clearTimeout);
    setBirthday("");
    setSign(null);
    setResult(null);
    setPhase("ask");
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-black tracking-[0.3em] text-[#fde68a] drop-shadow-[0_2px_0_#7f1d1d]">
          ⛩ 好運抽籤
        </h1>
        <p className="mt-2 text-sm opacity-75">
          誠心祈求，抽一支籤看看今日運勢與星座分析
        </p>
      </header>

      {/* 第一步：每次進來都先問生日 */}
      {phase === "ask" && (
        <form
          onSubmit={confirmBirthday}
          className="fx-card fx-fade flex w-full max-w-md flex-col items-center gap-5 p-8"
        >
          <h2 className="text-xl font-bold text-[#fde68a]">請問你的生日是？</h2>
          <input
            type="date"
            required
            value={birthday}
            max="2100-12-31"
            min="1900-01-01"
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full rounded-xl border-2 border-[#d4a017] bg-[#fdf3d7] px-4 py-3 text-center text-lg text-[#3b0d0d] outline-none focus:ring-4 focus:ring-[#fbbf24]/40"
          />
          <div className="h-10 text-center">
            {preview ? (
              <p className="fx-fade text-lg">
                你是{" "}
                <span className="text-2xl font-black text-[#fde68a]">
                  {preview.symbol} {preview.name}
                </span>
              </p>
            ) : (
              <p className="text-sm opacity-60">選好日期就會判讀你的星座</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!preview}
            className="w-full rounded-xl bg-gradient-to-b from-[#fbbf24] to-[#d4a017] py-3 text-lg font-black tracking-widest text-[#5c0f12] shadow-[0_5px_0_#92400e] transition active:translate-y-1 active:shadow-none disabled:opacity-40"
          >
            確認，前往抽籤
          </button>
        </form>
      )}

      {/* 第二步：星座卡 + 籤筒 */}
      {sign && phase !== "ask" && (
        <>
          <section className="fx-card fx-fade flex w-full items-center gap-5 p-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#d4a017] bg-[#3b0d0d] text-5xl text-[#fde68a]">
              {sign.symbol}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-2xl font-black text-[#fde68a]">
                  {sign.name}
                </h2>
                <span className="text-sm opacity-70">{sign.range}</span>
              </div>
              <p className="mt-1 text-sm opacity-85">
                {sign.element}象星座・守護星 {sign.ruler}・
                {sign.traits.join("、")}
              </p>
            </div>
            <button
              type="button"
              onClick={restart}
              className="shrink-0 self-start text-xs underline opacity-70 hover:opacity-100"
            >
              重新輸入生日
            </button>
          </section>

          {phase !== "result" && (
            <section className="flex flex-col items-center gap-6 py-4">
              <div className="relative mt-24">
                <div
                  className={`fx-tube ${phase === "shaking" ? "fx-shake" : ""}`}
                >
                  {STICKS.map((s, i) => (
                    <div
                      key={i}
                      className={`fx-stick ${phase === "popping" && i === POP_INDEX ? "fx-pop" : ""}`}
                      style={{
                        left: `${s.left - 4}px`,
                        height: `${s.h}px`,
                        rotate: `${s.rot}deg`,
                        zIndex: i === POP_INDEX ? 2 : 1,
                      }}
                    >
                      <div className="fx-stick-top" />
                    </div>
                  ))}
                  <div className="absolute inset-x-0 top-[72px] text-center text-3xl font-black text-[#fde68a] drop-shadow">
                    籤
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={shake}
                disabled={phase !== "ready"}
                className="rounded-full bg-gradient-to-b from-[#fbbf24] to-[#d4a017] px-10 py-3 text-xl font-black tracking-widest text-[#5c0f12] shadow-[0_5px_0_#92400e] transition active:translate-y-1 active:shadow-none disabled:opacity-60"
              >
                {phase === "shaking"
                  ? "搖籤中…"
                  : phase === "popping"
                    ? "籤出來了！"
                    : "誠心搖籤"}
              </button>
              <p className="text-xs opacity-60">心中默念想問的事，再按下搖籤</p>
            </section>
          )}
        </>
      )}

      {/* 第三步：籤詩與運勢 */}
      {phase === "result" && result && sign && (
        <>
          <section className="fx-slip fx-unfold flex w-full max-w-md flex-col items-center gap-4 px-6 py-6">
            <div className="text-sm tracking-[0.4em] text-[#7f1d1d]">
              第 {toChineseNumber(result.no)} 籤
            </div>
            <div
              className="text-6xl font-black tracking-widest"
              style={{ color: LEVELS[result.level].color }}
            >
              {result.level}
            </div>
            <div className="h-px w-full bg-[#b91c1c]/40" />
            <div className="fx-vertical flex h-52 flex-col gap-4 text-2xl font-bold leading-relaxed tracking-[0.2em]">
              {result.poem.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="h-px w-full bg-[#b91c1c]/40" />
            <p className="text-center text-base leading-relaxed">
              {result.summary}
            </p>
            <div className="text-xs opacity-60">{drawnAt}</div>
          </section>

          <section
            className="fx-card fx-fade w-full p-6"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="mb-3 text-xl font-black text-[#fde68a]">
              {sign.symbol} {sign.name}今日運勢
            </h3>
            <p className="mb-5 leading-relaxed">{result.overview}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.categories.map((c) => (
                <div key={c.name} className="rounded-xl bg-black/25 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold">{c.name}</span>
                    <Stars n={c.stars} />
                  </div>
                  <p className="text-sm leading-relaxed opacity-90">{c.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="fx-card fx-fade grid w-full gap-4 p-6 sm:grid-cols-2"
            style={{ animationDelay: "0.5s" }}
          >
            <div>
              <h3 className="mb-3 text-lg font-black text-[#fde68a]">
                今日幸運
              </h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="opacity-70">幸運色</dt>
                <dd>{result.lucky.color}</dd>
                <dt className="opacity-70">幸運數字</dt>
                <dd>{result.lucky.number}</dd>
                <dt className="opacity-70">幸運方位</dt>
                <dd>{result.lucky.direction}</dd>
                <dt className="opacity-70">開運小物</dt>
                <dd>{result.lucky.item}</dd>
                <dt className="opacity-70">速配星座</dt>
                <dd>
                  {result.lucky.match.symbol} {result.lucky.match.name}
                </dd>
              </dl>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="mb-2 text-lg font-black text-[#86efac]">宜</h3>
                <div className="flex flex-wrap gap-2">
                  {result.good.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-[#14532d]/70 px-3 py-1 text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-black text-[#fca5a5]">忌</h3>
                <div className="flex flex-wrap gap-2">
                  {result.bad.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-black/40 px-3 py-1 text-sm"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={shake}
              className="rounded-full bg-gradient-to-b from-[#fbbf24] to-[#d4a017] px-8 py-3 text-lg font-black tracking-widest text-[#5c0f12] shadow-[0_5px_0_#92400e] transition active:translate-y-1 active:shadow-none"
            >
              再抽一次
            </button>
            <button
              type="button"
              onClick={restart}
              className="rounded-full border-2 border-[#d4a017] px-6 py-3 text-lg font-bold text-[#fde68a] hover:bg-[#d4a017]/15"
            >
              換個生日
            </button>
          </div>
        </>
      )}

      <p className="text-center text-xs opacity-50">
        籤詩與運勢皆為隨機產生，僅供娛樂參考 🙏
      </p>
    </div>
  );
}

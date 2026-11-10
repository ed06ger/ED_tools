"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dealer, { type DealerMood } from "./Dealer";
import { spinLine, spinPhase, winLine, type SpinPhase } from "./dealerLines";
import "./lottery.css";

/** 外圈 8 格在 3x3 格子中的位置（順時針，從左上開始），4 是中間 */
const RING = [0, 1, 2, 5, 8, 7, 6, 3];
const SLOTS = RING.length;
const ROUNDS = 4; // 跑燈至少繞幾圈

/** 每張牌角落的小字，增加麻將感 */
const CORNER = ["東", "南", "西", "北", "發", "白", "萬", "筒"];
/** 牌面字色：紅、綠、藍輪替 */
const INK = ["#b91c1c", "#15803d", "#1d4ed8"];

const DEFAULT_NAMES = ["小明", "小華", "小美", "阿強", "小芳", "大雄"].join(
  "\n",
);

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 外框燈泡位置（0~1 的比例），每邊 BULBS_PER_SIDE 顆，沿著框順時針排列 */
const BULBS_PER_SIDE = 8;
const BULBS = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < BULBS_PER_SIDE; i++) {
    const t = i / BULBS_PER_SIDE;
    pts.push({ x: t, y: 0 }); // 上
  }
  for (let i = 0; i < BULBS_PER_SIDE; i++) {
    const t = i / BULBS_PER_SIDE;
    pts.push({ x: 1, y: t }); // 右
  }
  for (let i = 0; i < BULBS_PER_SIDE; i++) {
    const t = 1 - i / BULBS_PER_SIDE;
    pts.push({ x: t, y: 1 }); // 下
  }
  for (let i = 0; i < BULBS_PER_SIDE; i++) {
    const t = 1 - i / BULBS_PER_SIDE;
    pts.push({ x: 0, y: t }); // 左
  }
  return pts;
})();
/** 燈泡中心落在外框 padding（26px）的正中間 */
const bulbPos = (f: number) => `calc(13px + (100% - 26px) * ${f})`;

const isCJK = (s: string) => /^[㐀-鿿豈-﫿]+$/.test(s);

function nameClass(name: string) {
  if (isCJK(name) && name.length <= 4) {
    return `mj-vertical ${name.length <= 2 ? "text-4xl" : "text-2xl sm:text-3xl"}`;
  }
  if (name.length <= 4) return "text-2xl sm:text-3xl";
  if (name.length <= 8) return "text-base sm:text-xl";
  return "text-xs sm:text-sm";
}

/** 一個格子：board 中的名字索引（對應 names 的索引） */
type Board = number[];

export default function LotteryGrid() {
  const [input, setInput] = useState(DEFAULT_NAMES);
  const [boardOverride, setBoardOverride] = useState<Board | null>(null);
  const [active, setActive] = useState<number | null>(null); // 外圈第幾格亮
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [dealerSays, setDealerSays] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const names = useMemo(
    () =>
      input
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean),
    [input],
  );

  // 預設盤面：前 8 個名字
  const board: Board = boardOverride ?? names.slice(0, SLOTS).map((_, i) => i);
  const canSpin = !spinning && names.length >= 2;

  function updateInput(value: string) {
    setInput(value);
    setBoardOverride(null);
    setActive(null);
    setWinner(null);
  }

  function spin() {
    if (!canSpin) return;

    // 從全部名單中公平抽出得獎者
    const winnerIdx = randomInt(names.length);
    let nextBoard: Board;
    if (names.length > SLOTS) {
      // 超過 8 人：盤面放得獎者 + 隨機 7 位其他人
      const others = shuffle(
        names.map((_, i) => i).filter((i) => i !== winnerIdx),
      ).slice(0, SLOTS - 1);
      nextBoard = shuffle([winnerIdx, ...others]);
      setBoardOverride(nextBoard);
    } else {
      nextBoard = board;
    }

    const k = nextBoard.length;
    const target = nextBoard.indexOf(winnerIdx);
    const start = active ?? -1;
    const total = ROUNDS * k + ((((target - start) % k) + k) % k);

    setWinner(null);
    setSpinning(true);

    let step = 0;
    let pos = start;
    let line = "";
    let phase: SpinPhase | null = null;
    let lineAt = 0;
    const tick = () => {
      step++;
      pos = (pos + 1) % k;
      setActive(pos);
      if (step >= total) {
        finish(winnerIdx);
        return;
      }
      // 先快後慢
      const t = step / total;

      // 荷官台詞：進入新階段或已顯示超過 1.1 秒就換一句
      const now = Date.now();
      const nextPhase = spinPhase(t);
      if (nextPhase !== phase || now - lineAt > 1100) {
        phase = nextPhase;
        line = spinLine(nextPhase, names[nextBoard[pos]], line);
        lineAt = now;
        setDealerSays(line);
      }

      timer.current = setTimeout(tick, 45 + 380 * t ** 3);
    };
    tick();
  }

  function finish(winnerIdx: number) {
    const name = names[winnerIdx];
    setSpinning(false);
    setWinner(name);
    setDealerSays(winLine(name));
    setHistory((h) => [name, ...h]);
    if (removeWinner) {
      const rest = names.filter((_, i) => i !== winnerIdx);
      setInput(rest.join("\n"));
      setBoardOverride(null);
      setActive(null);
    }
  }

  // 組出 3x3 的 9 個格子
  const cells = Array.from({ length: 9 }, (_, gridPos) => {
    if (gridPos === 4) return { kind: "center" as const };
    const slot = RING.indexOf(gridPos);
    const nameIdx = board[slot];
    return nameIdx === undefined
      ? { kind: "empty" as const, slot }
      : { kind: "name" as const, slot, name: names[nameIdx] };
  });

  const dealerMood: DealerMood = spinning
    ? "spinning"
    : winner
      ? "win"
      : "idle";
  const dealerLine =
    (spinning || winner) && dealerSays
      ? dealerSays
      : names.length < 2
        ? "名單至少要兩個人喔～"
        : "準備好了嗎？按下紅中開局吧！";

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
      {/* 左側：名單與設定 */}
      <section className="flex min-w-0 flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-bold">
            抽獎名單{" "}
            <span className="text-sm font-normal opacity-60">
              （共 {names.length} 人）
            </span>
          </span>
          <textarea
            value={input}
            onChange={(e) => updateInput(e.target.value)}
            disabled={spinning}
            rows={12}
            placeholder={"一行一個名字，例如：\n小明\n小華"}
            className="w-full resize-y rounded-lg border-2 border-[#8a5428] bg-[#1a0f07] p-3 text-sm text-[#f5ecd7] outline-none placeholder:text-[#f5ecd7]/40 focus:border-[#fbbf24] disabled:opacity-60"
          />
        </label>

        {names.length > SLOTS && (
          <p className="rounded-md bg-[#fbbf24]/10 p-2 text-xs leading-relaxed text-[#fbbf24]">
            名單超過 8 人：每次都會從全部 {names.length} 人中公平抽出，
            九宮格會顯示得獎者與隨機 7 位候選人。
          </p>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            disabled={spinning}
            className="h-4 w-4 accent-[#b91c1c]"
          />
          抽中後自動從名單移除
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateInput("")}
            disabled={spinning}
            className="rounded-lg border-2 border-[#8a5428] px-3 py-2 text-sm hover:bg-[#8a5428]/30 disabled:opacity-50"
          >
            清空名單
          </button>
          <button
            type="button"
            onClick={() => setHistory([])}
            disabled={spinning || history.length === 0}
            className="rounded-lg border-2 border-[#8a5428] px-3 py-2 text-sm hover:bg-[#8a5428]/30 disabled:opacity-50"
          >
            清除紀錄
          </button>
        </div>

        {history.length > 0 && (
          <div>
            <h2 className="mb-2 font-bold">胡牌紀錄</h2>
            <ol className="flex flex-col gap-1 text-sm">
              {history.map((name, i) => (
                <li key={i} className="rounded bg-[#f5ecd7]/10 px-3 py-1.5">
                  第 {history.length - i} 局：{name}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* 右側：麻將九宮格 */}
      <section className="flex min-w-0 flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-center">
          {/* 荷官 */}
          <div className="flex w-52 shrink-0 flex-col items-center gap-3 sm:w-72 lg:order-2">
            <div
              className="mj-bubble flex min-h-14 w-full items-center justify-center px-3 py-2 text-center text-sm font-bold"
              aria-live="polite"
            >
              {dealerLine}
            </div>
            <div
              className={`mj-dealer ${spinning ? "mj-dealer-busy" : ""} w-full`}
            >
              <Dealer mood={dealerMood} />
            </div>
          </div>

          <div className={`mj-frame w-full max-w-[480px]`}>
            {BULBS.map((b, i) => (
              <span
                key={i}
                aria-hidden
                className={[
                  "mj-bulb",
                  i % 2 ? "mj-bulbAlt" : "",
                  spinning ? "mj-fast" : "",
                ].join(" ")}
                style={{ left: bulbPos(b.x), top: bulbPos(b.y) }}
              />
            ))}
            <div className={`mj-table p-4 pb-7 sm:p-6 sm:pb-9`}>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-7">
                {cells.map((cell, gridPos) => {
                  if (cell.kind === "center") {
                    return (
                      <button
                        key={gridPos}
                        type="button"
                        onClick={spin}
                        disabled={!canSpin}
                        aria-label="開始抽獎"
                        className={`mj-center flex aspect-[3/4] flex-col items-center justify-center gap-2 text-white disabled:opacity-85`}
                      >
                        <span className="flex h-8 w-6 items-center justify-center rounded-[4px] bg-[#fffdf6] text-lg font-black text-[#b91c1c] shadow-[0_2px_0_#1f7a4d] sm:h-10 sm:w-8 sm:text-2xl">
                          中
                        </span>
                        <span className="text-xl font-black leading-tight tracking-wider drop-shadow-[0_2px_0_#7f1d1d] sm:text-2xl">
                          {spinning ? (
                            "抽獎中"
                          ) : (
                            <>
                              {winner ? "再抽" : "立即"}
                              <br />
                              {winner ? "一次" : "抽獎"}
                            </>
                          )}
                        </span>
                      </button>
                    );
                  }

                  if (cell.kind === "empty") {
                    return (
                      <div
                        key={gridPos}
                        className={`mj-tile mj-back aspect-[3/4]`}
                        aria-hidden
                      />
                    );
                  }

                  const isActive = active === cell.slot;
                  const isWinner = isActive && !spinning && winner !== null;
                  return (
                    <div
                      key={gridPos}
                      className={[
                        "mj-tile",
                        isActive ? "mj-active" : "",
                        isWinner ? "mj-winner" : "",
                        "flex aspect-[3/4] items-center justify-center overflow-hidden p-1",
                      ].join(" ")}
                    >
                      <span className="absolute left-1.5 top-1 text-[10px] font-bold text-[#7c2d12]/60 sm:text-xs">
                        {CORNER[cell.slot]}
                      </span>
                      <span
                        className={`${nameClass(cell.name)} break-all text-center font-black leading-tight`}
                        style={{ color: INK[cell.slot % INK.length] }}
                      >
                        {cell.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {names.length < 2 && !spinning && (
          <p className="text-sm opacity-60">請至少輸入 2 個名字</p>
        )}

        <div className="min-h-20 text-center" aria-live="polite">
          {winner && (
            <div>
              <div className="text-sm tracking-widest opacity-70">
                胡了！恭喜
              </div>
              <div className="text-4xl font-black text-[#fbbf24] drop-shadow-[0_2px_0_#7c2d12]">
                🀄 {winner} 🀄
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

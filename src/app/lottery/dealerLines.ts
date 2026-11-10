/** 荷官台詞產生器：依抽獎進度與跑燈目前停在誰身上，隨機組出台詞 */

export type SpinPhase = "start" | "middle" | "slow";

const START = [
  "來囉～姐姐要開始轉了♪",
  "手氣好不好，就看這一把！",
  "眼睛別亂飄，看牌～",
  "莊家開局，誰敢跟？",
  "今晚的幸運兒是誰呢～",
];

const MIDDLE = [
  "「{name}」…你在偷看我嗎？",
  "會是「{name}」嗎？呵呵～",
  "「{name}」，想要姐姐選你嗎？",
  "嗯～跳過「{name}」囉",
  "「{name}」別緊張，還沒結束呢",
  "經過「{name}」了，可惜～",
  "「{name}」的手氣好像不錯？",
];

const SLOW = [
  "要慢下來囉…",
  "心跳加速了嗎？",
  "最後幾格了喔～",
  "屏住呼吸…",
  "停在「{name}」…才怪～",
  "「{name}」…還是下一個呢？",
];

const WIN = [
  "恭喜「{name}」胡了！🎉",
  "「{name}」，今晚你最旺！",
  "莊家認輸～恭喜「{name}」！",
  "就是你了，「{name}」♡",
  "「{name}」自摸！姐姐請客～",
];

function pick(pool: string[], name: string, avoid?: string) {
  let line = "";
  for (let i = 0; i < 5; i++) {
    line = pool[Math.floor(Math.random() * pool.length)].replaceAll(
      "{name}",
      name,
    );
    if (line !== avoid) break;
  }
  return line;
}

export function spinPhase(progress: number): SpinPhase {
  if (progress < 0.25) return "start";
  if (progress < 0.8) return "middle";
  return "slow";
}

export function spinLine(phase: SpinPhase, name: string, avoid?: string) {
  const pool = phase === "start" ? START : phase === "middle" ? MIDDLE : SLOW;
  return pick(pool, name, avoid);
}

export function winLine(name: string) {
  return pick(WIN, name);
}

/** 籤詩、運勢文字庫與隨機產生器（僅供娛樂） */

import { compatibleSigns, type Sign } from "./zodiac";

export type Level = "大吉" | "中吉" | "小吉" | "吉" | "末吉" | "凶" | "大凶";

type LevelInfo = {
  weight: number; // 抽中機率權重
  base: number; // 運勢星等基準（1–5）
  tone: "good" | "mid" | "bad";
  color: string; // 籤等文字顏色
  summary: string;
  poems: string[][];
};

export const LEVELS: Record<Level, LevelInfo> = {
  大吉: {
    weight: 10,
    base: 5,
    tone: "good",
    color: "#b91c1c",
    summary: "諸事順遂、心想事成！今天是放手去做的好日子，把握機會就對了。",
    poems: [
      ["春風得意馬蹄輕", "雲開月現滿天星", "所求諸事皆如願", "貴人相助步青雲"],
      ["紫氣東來福滿門", "金雞報曉喜盈盈", "前程似錦無阻礙", "一帆風順到天明"],
    ],
  },
  中吉: {
    weight: 15,
    base: 4,
    tone: "good",
    color: "#c2410c",
    summary: "運勢穩健向上，努力會被看見，只要按部就班，好消息就在不遠處。",
    poems: [
      ["細雨初晴見彩虹", "耕耘自有好收成", "莫急莫躁循序進", "花開時節自分明"],
      ["舟行半路遇順風", "守得雲開見日紅", "誠心待人人亦善", "好事將臨在眼中"],
    ],
  },
  小吉: {
    weight: 18,
    base: 4,
    tone: "mid",
    color: "#a16207",
    summary: "小確幸的一天，平凡中藏著驚喜，留意身邊的小事，福氣自然累積。",
    poems: [
      ["小橋流水自清幽", "平淡之中有樂頭", "知足常樂心安穩", "積少成多福自留"],
      ["一步一腳踏實行", "微光漸亮照前程", "小事用心多留意", "喜從細處悄然生"],
    ],
  },
  吉: {
    weight: 20,
    base: 3,
    tone: "mid",
    color: "#15803d",
    summary: "平安順利的一天，沒有大起大落，守住本分就能過得安穩自在。",
    poems: [
      ["日出東山照四方", "平平順順路寬長", "守本分時無大礙", "心存善念福綿長"],
      ["門前綠柳正逢春", "處處溫和處處新", "不求大富求安樂", "平安便是有福人"],
    ],
  },
  末吉: {
    weight: 15,
    base: 3,
    tone: "mid",
    color: "#0e7490",
    summary: "先苦後甘，一開始或許不太順，但耐心撐過去，運勢會慢慢好轉。",
    poems: [
      ["枯木逢春待發芽", "寒冬過後見梅花", "眼前雖有些微阻", "耐心守候福到家"],
      ["雲遮月色暫朦朧", "風過自然見明空", "先苦後甘終有報", "莫因一時失從容"],
    ],
  },
  凶: {
    weight: 14,
    base: 2,
    tone: "bad",
    color: "#4b5563",
    summary: "今天容易遇到阻礙，凡事三思而後行，低調一點反而能避開麻煩。",
    poems: [
      ["烏雲壓頂雨將來", "行事三思莫妄開", "退一步時天地闊", "靜待時機轉運來"],
      ["路遇泥濘步難行", "口舌是非易相爭", "謹言慎行保平安", "守得心定自然清"],
    ],
  },
  大凶: {
    weight: 8,
    base: 1,
    tone: "bad",
    color: "#111827",
    summary:
      "別擔心！大凶代表運勢已到谷底，接下來只會越來越好。今天宜靜不宜動，好好照顧自己。",
    poems: [
      ["狂風驟雨夜沉沉", "諸事不宜莫強爭", "低調守己避鋒芒", "否極泰來在後程"],
      ["山高水險路崎嶇", "錢財出入要提防", "今朝宜靜不宜動", "明日陽光再啟航"],
    ],
  },
};

export type Category = "愛情" | "事業" | "財運" | "健康";
export const CATEGORIES: Category[] = ["愛情", "事業", "財運", "健康"];

/** 各類別依星等分 high（4–5）/ mid（3）/ low（1–2） */
const CATEGORY_TEXT: Record<
  Category,
  Record<"high" | "mid" | "low", string[]>
> = {
  愛情: {
    high: [
      "桃花朵朵開，{trait}的你今天特別有魅力，單身者有機會遇到心動對象。",
      "感情甜蜜升溫，主動傳個訊息給在意的人，會收到意想不到的回應。",
      "和另一半默契十足，適合一起規劃小約會，增進彼此感情。",
    ],
    mid: [
      "感情平穩，多一點傾聽就能讓關係更融洽。",
      "單身者可以多參加聚會，緣分可能就在朋友的朋友之中。",
      "別急著要答案，順其自然反而更有好結果。",
    ],
    low: [
      "容易因小事鬧情緒，說話前先深呼吸，避免口角。",
      "今天不適合翻舊帳，給彼此一點空間會更好。",
      "對感情少一點猜測，有疑問就直接溝通。",
    ],
  },
  事業: {
    high: [
      "工作效率極高，{strength}今天特別發揮，主管看在眼裡。",
      "適合提出新想法或爭取機會，貴人運強，容易得到支持。",
      "手上的案子進展順利，有機會提前完成，獲得肯定。",
    ],
    mid: [
      "工作按部就班即可，把細節做好就是最大的加分。",
      "適合整理待辦事項，排好優先順序，效率會提升不少。",
      "同事間合作順暢，遇到問題多問一句就能解決。",
    ],
    low: [
      "容易出現小失誤，重要文件記得多檢查一次。",
      "注意{weakness}，遇到壓力先暫停一下再做決定。",
      "今天不宜和人硬碰硬，保留意見、等待更好的時機。",
    ],
  },
  財運: {
    high: [
      "財運亨通，可能有意外之財或小獎金入袋。",
      "投資眼光精準，但仍要見好就收，別貪心。",
      "適合規劃理財，今天做的決定對未來很有幫助。",
    ],
    mid: [
      "收支平衡，適合記帳、檢視不必要的訂閱支出。",
      "小額消費帶來好心情，但大筆開銷再想一想。",
      "財運普通，穩健保守是最好的策略。",
    ],
    low: [
      "容易衝動購物，結帳前先把東西放購物車冷靜一下。",
      "借錢或作保要特別小心，今天不宜有金錢往來。",
      "注意錢包與財物，出門前多檢查一次。",
    ],
  },
  健康: {
    high: [
      "精神飽滿、活力充沛，很適合運動或戶外走走。",
      "身心狀態都很好，保持規律作息就能延續好氣色。",
      "睡眠品質佳，整天都神清氣爽。",
    ],
    mid: [
      "體力尚可，記得多喝水、別久坐。",
      "工作之餘起身伸展一下，肩頸會舒服很多。",
      "飲食清淡一點，腸胃會感謝你。",
    ],
    low: [
      "容易感到疲倦，今天早點休息，別熬夜。",
      "注意保暖與飲食衛生，小心著涼或腸胃不適。",
      "壓力比較大，找時間做點讓自己放鬆的事。",
    ],
  },
};

const ELEMENT_TEXT: Record<
  Sign["element"],
  Record<LevelInfo["tone"], string[]>
> = {
  火: {
    good: [
      "火象能量正旺，你的熱情會感染身邊每個人。",
      "行動力爆發，想做的事今天就動手吧！",
    ],
    mid: [
      "火象的你今天適合把熱情放在一件事上，專注會帶來成果。",
      "衝勁不減，但記得偶爾停下來看看方向。",
    ],
    bad: [
      "火氣容易上升，遇事先冷靜三秒再回應。",
      "能量有點過旺，小心說話太直傷到人。",
    ],
  },
  土: {
    good: [
      "土象的穩定力量讓你今天特別可靠，大家都想找你商量。",
      "踏實的努力今天開花結果，收穫滿滿。",
    ],
    mid: [
      "穩紮穩打是你的優勢，今天照自己的節奏走就好。",
      "適合整理環境與計畫，會讓心情跟著清爽。",
    ],
    bad: [
      "容易鑽牛角尖，試著換個角度看事情。",
      "別把所有責任都攬在身上，適時求助也沒關係。",
    ],
  },
  風: {
    good: [
      "風象的靈感源源不絕，今天的點子特別有價值。",
      "人緣極佳，社交場合中你就是焦點。",
    ],
    mid: [
      "思緒活躍，適合學習新東西或和朋友交流。",
      "保持彈性，計畫有變動也能輕鬆應對。",
    ],
    bad: [
      "想法太多容易分心，一次只做一件事。",
      "小心訊息傳達出錯，重要的事用文字確認。",
    ],
  },
  水: {
    good: [
      "水象的直覺今天特別準，相信你的第一感覺。",
      "溫柔的特質吸引好運，貴人主動靠近。",
    ],
    mid: [
      "情感細膩，適合寫寫日記、整理心情。",
      "順著感覺走，但重要決定還是要理性評估。",
    ],
    bad: [
      "情緒起伏較大，別讓別人的話影響太深。",
      "容易想太多，今天早點休息，明天會更好。",
    ],
  },
};

const LUCKY_COLORS = [
  "朱紅",
  "金黃",
  "翡翠綠",
  "天空藍",
  "薰衣草紫",
  "珊瑚粉",
  "象牙白",
  "墨黑",
  "橘色",
  "薄荷綠",
  "酒紅",
  "銀灰",
];
const LUCKY_ITEMS = [
  "一杯熱茶",
  "紅色小物",
  "喜歡的香水",
  "一本書",
  "耳機",
  "手寫筆記本",
  "幸運手鍊",
  "零錢包",
  "綠色植物",
  "一顆糖果",
];
const DIRECTIONS = [
  "東方",
  "南方",
  "西方",
  "北方",
  "東南方",
  "西南方",
  "東北方",
  "西北方",
];
const GOOD_TODO = [
  "整理房間",
  "聯絡老朋友",
  "學新技能",
  "運動流汗",
  "早睡早起",
  "嘗試新餐廳",
  "許願",
  "斷捨離",
  "讀書進修",
  "曬太陽",
  "做規劃",
  "表達感謝",
];
const BAD_TODO = [
  "衝動購物",
  "熬夜",
  "與人爭執",
  "借錢給人",
  "拖延",
  "暴飲暴食",
  "做重大決定",
  "翻舊帳",
  "說人閒話",
  "賭博",
];

export function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function pick<T>(arr: T[]): T {
  return arr[randomInt(arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function drawLevel(): Level {
  const entries = Object.entries(LEVELS) as [Level, LevelInfo][];
  const total = entries.reduce((s, [, v]) => s + v.weight, 0);
  let r = randomInt(total);
  for (const [level, info] of entries) {
    if (r < info.weight) return level;
    r -= info.weight;
  }
  return "吉";
}

export type FortuneResult = {
  no: number;
  level: Level;
  poem: string[];
  summary: string;
  overview: string;
  categories: { name: Category; stars: number; text: string }[];
  lucky: {
    color: string;
    number: number;
    direction: string;
    item: string;
    match: Sign;
  };
  good: string[];
  bad: string[];
};

export function drawFortune(sign: Sign): FortuneResult {
  const level = drawLevel();
  const info = LEVELS[level];

  const fill = (s: string) =>
    s
      .replace("{trait}", pick(sign.traits))
      .replace("{strength}", sign.strength)
      .replace("{weakness}", sign.weakness);

  const categories = CATEGORIES.map((name) => {
    const stars = Math.min(5, Math.max(1, info.base + randomInt(3) - 1));
    const bucket = stars >= 4 ? "high" : stars === 3 ? "mid" : "low";
    return { name, stars, text: fill(pick(CATEGORY_TEXT[name][bucket])) };
  });

  const overview = `${sign.name}的你${pick(sign.traits)}，守護星${sign.ruler}今天${
    info.tone === "good"
      ? "帶來滿滿好能量"
      : info.tone === "mid"
        ? "給你溫和的支持"
        : "提醒你放慢腳步"
  }。${pick(ELEMENT_TEXT[sign.element][info.tone])}`;

  return {
    no: randomInt(100) + 1,
    level,
    poem: pick(info.poems),
    summary: info.summary,
    overview,
    categories,
    lucky: {
      color: pick(LUCKY_COLORS),
      number: randomInt(99) + 1,
      direction: pick(DIRECTIONS),
      item: pick(LUCKY_ITEMS),
      match: pick(compatibleSigns(sign)),
    },
    good: pickN(GOOD_TODO, 3),
    bad: pickN(BAD_TODO, 2),
  };
}

/** 數字轉國字（1–100），用於「第○籤」 */
export function toChineseNumber(n: number) {
  const d = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (n === 100) return "一百";
  if (n < 10) return d[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${tens === 1 ? "" : d[tens]}十${ones ? d[ones] : ""}`;
}

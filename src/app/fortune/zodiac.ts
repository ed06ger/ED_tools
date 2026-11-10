/** 十二星座資料與生日判讀 */

export type Element = "火" | "土" | "風" | "水";

export type Sign = {
  id: string;
  name: string;
  symbol: string;
  range: string;
  element: Element;
  ruler: string;
  traits: string[]; // 個性特質，用在運勢文字裡
  strength: string;
  weakness: string;
};

export const SIGNS: Sign[] = [
  {
    id: "capricorn",
    name: "摩羯座",
    symbol: "♑",
    range: "12/22 – 1/19",
    element: "土",
    ruler: "土星",
    traits: ["踏實穩重", "目標明確", "責任感強"],
    strength: "耐力與自律",
    weakness: "容易把自己逼太緊",
  },
  {
    id: "aquarius",
    name: "水瓶座",
    symbol: "♒",
    range: "1/20 – 2/18",
    element: "風",
    ruler: "天王星",
    traits: ["獨立創新", "思想前衛", "重視自由"],
    strength: "創意與洞察",
    weakness: "有時顯得疏離",
  },
  {
    id: "pisces",
    name: "雙魚座",
    symbol: "♓",
    range: "2/19 – 3/20",
    element: "水",
    ruler: "海王星",
    traits: ["浪漫敏感", "富同理心", "直覺敏銳"],
    strength: "想像力與溫柔",
    weakness: "容易情緒化、想太多",
  },
  {
    id: "aries",
    name: "牡羊座",
    symbol: "♈",
    range: "3/21 – 4/19",
    element: "火",
    ruler: "火星",
    traits: ["熱情直率", "行動力強", "勇於挑戰"],
    strength: "衝勁與勇氣",
    weakness: "容易衝動、缺乏耐心",
  },
  {
    id: "taurus",
    name: "金牛座",
    symbol: "♉",
    range: "4/20 – 5/20",
    element: "土",
    ruler: "金星",
    traits: ["穩定可靠", "重視享受", "務實耐心"],
    strength: "堅持與品味",
    weakness: "有點固執",
  },
  {
    id: "gemini",
    name: "雙子座",
    symbol: "♊",
    range: "5/21 – 6/21",
    element: "風",
    ruler: "水星",
    traits: ["聰明機智", "好奇心旺盛", "反應靈敏"],
    strength: "溝通與學習力",
    weakness: "注意力容易分散",
  },
  {
    id: "cancer",
    name: "巨蟹座",
    symbol: "♋",
    range: "6/22 – 7/22",
    element: "水",
    ruler: "月亮",
    traits: ["溫柔顧家", "重感情", "保護欲強"],
    strength: "照顧人的能力",
    weakness: "容易缺乏安全感",
  },
  {
    id: "leo",
    name: "獅子座",
    symbol: "♌",
    range: "7/23 – 8/22",
    element: "火",
    ruler: "太陽",
    traits: ["自信大方", "充滿魅力", "天生領袖"],
    strength: "領導力與熱情",
    weakness: "愛面子",
  },
  {
    id: "virgo",
    name: "處女座",
    symbol: "♍",
    range: "8/23 – 9/22",
    element: "土",
    ruler: "水星",
    traits: ["細心謹慎", "追求完美", "條理分明"],
    strength: "分析與執行力",
    weakness: "對自己太挑剔",
  },
  {
    id: "libra",
    name: "天秤座",
    symbol: "♎",
    range: "9/23 – 10/23",
    element: "風",
    ruler: "金星",
    traits: ["優雅和諧", "重視公平", "人緣極佳"],
    strength: "協調與美感",
    weakness: "容易猶豫不決",
  },
  {
    id: "scorpio",
    name: "天蠍座",
    symbol: "♏",
    range: "10/24 – 11/22",
    element: "水",
    ruler: "冥王星",
    traits: ["神秘深沉", "意志堅定", "洞察力強"],
    strength: "專注與執著",
    weakness: "佔有欲較強",
  },
  {
    id: "sagittarius",
    name: "射手座",
    symbol: "♐",
    range: "11/23 – 12/21",
    element: "火",
    ruler: "木星",
    traits: ["樂觀開朗", "熱愛自由", "愛冒險"],
    strength: "樂觀與行動力",
    weakness: "有時太過隨性",
  },
];

/** 各星座開始日（月, 日），依 SIGNS 順序 */
const STARTS: [number, number][] = [
  [12, 22],
  [1, 20],
  [2, 19],
  [3, 21],
  [4, 20],
  [5, 21],
  [6, 22],
  [7, 23],
  [8, 23],
  [9, 23],
  [10, 24],
  [11, 23],
];

export function signOf(month: number, day: number): Sign {
  const md = month * 100 + day;
  // 找出最後一個「開始日 <= 生日」的星座；1/1–1/19 與 12/22 之後都是摩羯座
  let idx = 0;
  for (let i = 1; i < STARTS.length; i++) {
    const [m, d] = STARTS[i];
    if (md >= m * 100 + d) idx = i;
  }
  if (md >= 1222) idx = 0;
  return SIGNS[idx];
}

/** 元素相合：火風相生、土水相生，同元素也合 */
export function compatibleSigns(sign: Sign) {
  const pair: Record<Element, Element> = {
    火: "風",
    風: "火",
    土: "水",
    水: "土",
  };
  return SIGNS.filter(
    (s) =>
      s.id !== sign.id &&
      (s.element === sign.element || s.element === pair[sign.element]),
  );
}

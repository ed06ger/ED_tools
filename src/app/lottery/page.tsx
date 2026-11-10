import type { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";
import BackHome from "../_components/BackHome";
import LotteryGrid from "./LotteryGrid";

const serifTC = Noto_Serif_TC({
  weight: ["700", "900"],
  // 中文字型檔很大，不預載，改由瀏覽器依 unicode-range 按需載入
  preload: false,
});

export const metadata: Metadata = {
  title: "麻將九宮格抽獎 | ed_tools",
  description: "輸入名單，用麻將風格的九宮格抽出得獎者",
};

export default function LotteryPage() {
  return (
    <main
      className={`${serifTC.className} flex-1 bg-[#2a1a0e] px-4 py-10 text-[#f5ecd7]`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <BackHome className="mb-6 border-[#8a5428] text-[#f5ecd7]/85 hover:border-[#fbbf24] hover:text-[#fbbf24]" />
        <h1 className="mb-2 text-3xl font-black tracking-widest">
          🀄 麻將九宮格抽獎
        </h1>
        <p className="mb-8 text-sm opacity-70">
          在左側輸入名單（一行一個名字），按下中間的「紅中」開始抽獎。
        </p>
        <LotteryGrid />
      </div>
    </main>
  );
}

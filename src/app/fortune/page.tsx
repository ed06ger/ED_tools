import type { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";
import BackHome from "../_components/BackHome";
import Fortune from "./Fortune";
import "./fortune.css";

const serifTC = Noto_Serif_TC({
  weight: ["400", "700", "900"],
  // 中文字型檔很大，不預載，改由瀏覽器依 unicode-range 按需載入
  preload: false,
});

export const metadata: Metadata = {
  title: "好運抽籤 | ed_tools",
  description: "輸入生日判讀星座，抽一支籤看看今天的運勢",
};

export default function FortunePage() {
  return (
    <main
      className={`${serifTC.className} fx-bg flex-1 px-4 py-10 text-[#fdf3d7]`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <BackHome className="mb-6 border-[#d4a017]/70 text-[#fde68a]/90 hover:border-[#fde68a] hover:bg-[#d4a017]/15 hover:text-[#fde68a]" />
        <Fortune />
      </div>
    </main>
  );
}

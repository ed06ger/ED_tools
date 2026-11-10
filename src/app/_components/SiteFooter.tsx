import Link from "next/link";
import { Hanko, Seigaiha } from "./Ornaments";
import { TOOLS } from "./tools";

export default function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#1b2b47] text-[#efe6d2]">
      {/* 頂端青海波帶 */}
      <Seigaiha
        id="footer-wave"
        className="block h-10 w-full opacity-90"
        stroke="#b8923a"
        fill="#1b2b47"
        size={36}
      />
      <div className="h-px bg-[#b8923a]/60" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Hanko className="h-12 w-12 -rotate-6" />
            <div>
              <div className="text-xl font-black tracking-[0.18em]">
                ED的小工具箱
              </div>
              <div className="ed-en text-xs tracking-[0.3em] text-[#d9b867]">
                Little Toolbox
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-7 text-[#efe6d2]/75">
            把日常裡的小事，做成順手又好看的工具。
            <br />
            願你今天也是好日子。
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-xs tracking-[0.4em] text-[#d9b867]">道具</h2>
          <ul className="space-y-3 text-sm">
            {TOOLS.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="ed-footlink">
                  <span className="mr-2 text-[#d9b867]">{t.numeral}</span>
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs tracking-[0.4em] text-[#d9b867]">
            小提醒
          </h2>
          <ul className="space-y-3 text-sm leading-6 text-[#efe6d2]/75">
            <li>設定與紀錄只存在你自己的瀏覽器。</li>
            <li>抽籤與運勢僅供娛樂參考。</li>
            <li>番茄鐘建議搭配一杯熱茶。</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#efe6d2]/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[#efe6d2]/55 sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 ED的小工具箱</span>
          <span className="tracking-[0.4em]">日日是好日</span>
        </div>
      </div>
    </footer>
  );
}

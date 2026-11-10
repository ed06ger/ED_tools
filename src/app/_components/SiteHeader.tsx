import Link from "next/link";
import { Hanko } from "./Ornaments";
import { TOOLS } from "./tools";

export default function SiteHeader() {
  return (
    <header className="ed-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="ED的小工具箱 首頁"
        >
          <Hanko className="h-9 w-9 -rotate-6 transition-transform duration-300 group-hover:rotate-0 lg:h-11 lg:w-11" />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-[0.18em] text-[#1d1a17] lg:text-xl">
              ED的小工具箱
            </span>
            <span className="ed-en mt-1 text-[11px] tracking-[0.3em] text-[#8a6a2a]">
              Little Toolbox
            </span>
          </span>
        </Link>

        {/* 平板、電腦：橫向選單 */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="主選單">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="ed-navlink">
              <span className="text-[#b8923a]">{t.numeral}</span>
              {t.name}
            </Link>
          ))}
        </nav>

        {/* 手機：折疊選單（不需要 JavaScript） */}
        <details className="ed-menu md:hidden">
          <summary
            aria-label="開啟選單"
            className="flex h-10 w-10 cursor-pointer items-center justify-center"
          >
            <span className="ed-burger" aria-hidden />
          </summary>
          <nav className="ed-menu-panel" aria-label="主選單">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-baseline gap-3 px-6 py-4"
              >
                <span className="text-xl font-black text-[#c8402d]">
                  {t.numeral}
                </span>
                <span className="text-base font-bold tracking-widest">
                  {t.name}
                </span>
                <span className="ed-en ml-auto text-xs text-[#8a6a2a]">
                  {t.en}
                </span>
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

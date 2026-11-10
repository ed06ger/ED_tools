import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Noto_Serif_TC } from "next/font/google";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";
import {
  Cloud,
  Divider,
  FortuneArt,
  Hanko,
  LotteryArt,
  PomodoroArt,
  Seigaiha,
  SeigaihaPattern,
} from "./_components/Ornaments";
import { TOOLS } from "./_components/tools";
import "./home.css";

const serifTC = Noto_Serif_TC({
  weight: ["400", "700", "900"],
  preload: false, // 中文字型很大，依 unicode-range 按需載入
});

const cormorant = Cormorant_Garamond({
  weight: ["500", "600"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-ed-en",
});

export const metadata: Metadata = {
  title: "ED的小工具箱",
  description: "抽獎、番茄鐘、好運抽籤——把日常小事做成順手又好看的工具。",
};

const ARTS = [LotteryArt, PomodoroArt, FortuneArt];

/** 飄落的櫻花瓣（位置、大小、速度刻意不規則） */
const PETALS = [
  { left: "6%", size: 12, dur: 13, delay: -2 },
  { left: "18%", size: 9, dur: 16, delay: -9 },
  { left: "31%", size: 14, dur: 12, delay: -5 },
  { left: "47%", size: 8, dur: 18, delay: -12 },
  { left: "58%", size: 11, dur: 14, delay: -1 },
  { left: "71%", size: 13, dur: 15, delay: -7 },
  { left: "83%", size: 9, dur: 17, delay: -14 },
  { left: "93%", size: 12, dur: 13, delay: -4 },
];

export default function Home() {
  return (
    <div
      className={`${serifTC.className} ${cormorant.variable} ed-paper flex min-h-full flex-1 flex-col text-[#1d1a17]`}
    >
      <SiteHeader />

      <main className="flex-1">
        {/* ================= Hero ================= */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {PETALS.map((p, i) => (
              <span
                key={i}
                className="ed-petal"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.8,
                  animationDuration: `${p.dur}s, ${p.dur / 3}s`,
                  animationDelay: `${p.delay}s, ${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* 左側直書標語（電腦版） */}
          <div
            className="absolute left-6 top-16 hidden flex-col items-center gap-4 xl:flex"
            aria-hidden
          >
            <span className="ed-vertical text-sm tracking-[0.6em] text-[#8a6a2a]">
              日日是好日
            </span>
            <span className="h-24 w-px bg-[#b8923a]/60" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="ed-rise">
              <p className="ed-en flex items-center gap-3 text-sm tracking-[0.25em] text-[#8a6a2a]">
                <span className="h-px w-10 bg-[#b8923a]" />
                ED&apos;s Little Toolbox
              </p>
              <h1 className="mt-6">
                <span className="block text-2xl font-bold tracking-[0.3em] text-[#c8402d] sm:text-3xl">
                  ED的
                </span>
                <span className="mt-1 block text-[3.4rem] font-black leading-[1.05] tracking-[0.12em] sm:text-7xl lg:text-[5.5rem]">
                  小工具箱
                </span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-8 text-[#3d362e] sm:text-lg sm:leading-9">
                把日常裡的小事，做成順手又好看的工具。
                <br className="hidden sm:block" />
                抽獎、專注、問問今天的運氣——打開就能用。
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href="#tools" className="ed-btn">
                  看看有哪些道具
                </a>
                <Link href="/fortune" className="ed-textlink">
                  或是，先抽一支籤 →
                </Link>
              </div>

              {/* 小目錄 */}
              <ol className="mt-12 grid max-w-md grid-cols-3 border-y border-[#b8923a]/40">
                {TOOLS.map((t, i) => (
                  <li
                    key={t.href}
                    className={i > 0 ? "border-l border-[#b8923a]/40" : ""}
                  >
                    <Link href={t.href} className="ed-index group">
                      <span className="text-2xl font-black text-[#c8402d] transition-transform duration-300 group-hover:-translate-y-0.5">
                        {t.numeral}
                      </span>
                      <span className="text-sm tracking-[0.3em]">
                        {t.short}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Hero 插畫：朱日、金雲、青海波 */}
            <div
              className="ed-rise relative mx-auto aspect-square w-full max-w-[460px]"
              style={{ animationDelay: "0.15s" }}
              aria-hidden
            >
              <div className="absolute inset-[8%] rounded-full border border-[#b8923a]/70" />
              <div className="absolute inset-[4%] rounded-full border border-dashed border-[#b8923a]/40" />
              <div className="ed-sun absolute inset-[15%] rounded-full" />
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <SeigaihaPattern
                    id="hero-wave"
                    stroke="#b8923a"
                    fill="#23395d"
                    size={34}
                  />
                  <clipPath id="hero-wave-clip">
                    <path d="M0 268 C 60 240 110 300 180 270 C 250 240 300 292 400 258 L 400 400 L 0 400 Z" />
                  </clipPath>
                  {/* 整個海浪收在圓形裡，像一枚圓形徽章 */}
                  <clipPath id="hero-medallion">
                    <circle cx="200" cy="200" r="167" />
                  </clipPath>
                </defs>
                <g clipPath="url(#hero-medallion)">
                  <rect
                    width="400"
                    height="400"
                    fill="url(#hero-wave)"
                    clipPath="url(#hero-wave-clip)"
                  />
                  <path
                    d="M0 268 C 60 240 110 300 180 270 C 250 240 300 292 400 258"
                    fill="none"
                    stroke="#d9b867"
                    strokeWidth="2.5"
                  />
                </g>
              </svg>
              <Cloud className="ed-float absolute left-[-4%] top-[18%] w-[42%] text-[#b8923a]" />
              <Cloud className="ed-float absolute right-[-6%] top-[50%] w-[36%] text-[#b8923a] [animation-delay:-3s]" />
              {/* 直書掛籤 */}
              <div className="absolute right-[10%] top-[6%] flex flex-col items-center">
                <span className="h-6 w-px bg-[#1d1a17]/60" />
                <div className="ed-tag ed-vertical">小工具箱</div>
              </div>
              <Hanko className="absolute bottom-[30%] left-[14%] h-14 w-14 rotate-[-10deg] drop-shadow" />
            </div>
          </div>
        </section>

        {/* ================= Tools ================= */}
        <section
          id="tools"
          className="relative scroll-mt-20 border-t border-[#b8923a]/30 py-16 sm:py-20 lg:py-28"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <header className="mx-auto mb-14 max-w-xl text-center lg:mb-20">
              <p className="ed-en text-sm tracking-[0.3em] text-[#8a6a2a]">
                Three Tools
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[0.3em] sm:text-4xl">
                三件道具
              </h2>
              <Divider className="mx-auto mt-6 max-w-xs" />
            </header>

            <div className="flex flex-col gap-16 sm:gap-20 lg:gap-28">
              {TOOLS.map((t, i) => {
                const Art = ARTS[i];
                const flip = i % 2 === 1;
                return (
                  <article
                    key={t.href}
                    className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16"
                  >
                    {/* 插畫面板 */}
                    <Link
                      href={t.href}
                      className={`ed-panel group relative block aspect-[5/4] overflow-hidden ${flip ? "md:order-2" : ""}`}
                      aria-label={`前往${t.name}`}
                    >
                      <span className="ed-watermark" aria-hidden>
                        {t.numeral}
                      </span>
                      <Seigaiha
                        id={`panel-wave-${i}`}
                        className="absolute inset-x-0 bottom-0 h-[22%] w-full opacity-[0.16]"
                        stroke="#23395d"
                        fill="#fbf6ea"
                        size={28}
                      />
                      <Art className="relative z-10 mx-auto h-full w-[70%] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03]" />
                      <span className="ed-en ed-vertical absolute right-4 top-4 text-xs tracking-[0.4em] text-[#8a6a2a]">
                        {t.en}
                      </span>
                    </Link>

                    {/* 文字 */}
                    <div className={flip ? "md:order-1" : ""}>
                      <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-black text-[#c8402d] sm:text-6xl">
                          {t.numeral}
                        </span>
                        <span className="ed-en text-base tracking-[0.25em] text-[#8a6a2a]">
                          No.{i + 1} — {t.en}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-black tracking-[0.15em] sm:text-3xl">
                        {t.name}
                      </h3>
                      <p className="mt-3 border-l-2 border-[#c8402d] pl-4 text-base text-[#5a4a35]">
                        {t.tagline}
                      </p>
                      <p className="mt-5 leading-8 text-[#3d362e]">{t.desc}</p>
                      <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                        {t.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5">
                            <span
                              className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#b8923a]"
                              aria-hidden
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={t.href}
                        className="ed-btn ed-btn-outline mt-8"
                      >
                        前往{t.short}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 語錄帶 ================= */}
        <section className="relative overflow-hidden border-y border-[#b8923a]/40 bg-[#efe5cf] py-16 sm:py-20">
          <Cloud className="absolute -left-10 top-6 w-48 text-[#b8923a]/60 sm:w-64" />
          <Cloud className="absolute -right-12 bottom-4 w-52 text-[#b8923a]/60 sm:w-72" />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <p className="text-2xl font-bold leading-relaxed tracking-[0.2em] sm:text-3xl">
              小小的工具，
              <br className="sm:hidden" />
              讓每天多一點儀式感。
            </p>
            <p className="ed-en mt-4 text-sm tracking-[0.3em] text-[#8a6a2a]">
              Small tools, little rituals.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

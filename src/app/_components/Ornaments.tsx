/** 日式紋樣與裝飾（純 SVG） */

/** 青海波紋樣：放在 <defs> 裡，之後用 fill="url(#id)" 套用 */
export function SeigaihaPattern({
  id,
  stroke,
  fill,
  size = 40,
}: {
  id: string;
  stroke: string;
  fill: string;
  size?: number;
}) {
  const r = size / 2;
  const fan = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      {[1, 0.75, 0.5, 0.25].map((k) => (
        <circle
          key={k}
          cx={cx}
          cy={cy}
          r={r * k}
          fill={fill}
          stroke={stroke}
          strokeWidth={size / 40}
        />
      ))}
    </g>
  );
  // 由上往下畫，下排的扇形會蓋住上排，形成波浪鱗片
  return (
    <pattern
      id={id}
      width={size}
      height={size / 2}
      patternUnits="userSpaceOnUse"
    >
      {fan(r, 0)}
      {fan(0, r / 2)}
      {fan(size, r / 2)}
      {fan(r, r)}
    </pattern>
  );
}

/** 一整塊青海波 */
export function Seigaiha({
  className,
  stroke = "#b8923a",
  fill = "#23395d",
  size = 40,
  id = "seigaiha",
}: {
  className?: string;
  stroke?: string;
  fill?: string;
  size?: number;
  id?: string;
}) {
  return (
    <svg className={className} aria-hidden preserveAspectRatio="none">
      <defs>
        <SeigaihaPattern id={id} stroke={stroke} fill={fill} size={size} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** 朱紅印章：邊緣用雜訊濾鏡做出蓋印的不規則感 */
export function Hanko({
  text = "ED",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <filter id="hanko-ink">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="2.4" />
        </filter>
      </defs>
      <g filter="url(#hanko-ink)">
        <rect x="4" y="4" width="56" height="56" rx="9" fill="#c8402d" />
        <rect
          x="9"
          y="9"
          width="46"
          height="46"
          rx="5"
          fill="none"
          stroke="#f6f0e4"
          strokeWidth="1.6"
        />
        <text
          x="32"
          y="41"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fill="#f6f0e4"
          fontFamily="serif"
          letterSpacing="1"
        >
          {text}
        </text>
      </g>
    </svg>
  );
}

/** 金色瑞雲 */
export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} aria-hidden>
      <path
        d="M10 62 H190 M30 62 C22 48 34 34 50 40 C50 22 74 16 86 30 C94 12 124 12 130 32 C142 22 166 28 162 46 C176 46 182 56 176 62"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 46 c0 -8 12 -8 12 0 c0 5 -7 5 -7 1 M104 36 c0 -9 14 -9 14 0 c0 6 -8 6 -8 1 M142 48 c0 -6 9 -6 9 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 菱形分隔線 */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#b8923a]" />
      <span className="h-2 w-2 rotate-45 border border-[#b8923a]" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[#c8402d]" />
      <span className="h-2 w-2 rotate-45 border border-[#b8923a]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#b8923a]" />
    </div>
  );
}

/* ---------- 三個工具的線稿插圖 ---------- */

export function LotteryArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {/* 九宮格麻將牌 */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const center = r === 1 && c === 1;
          const lit = r === 0 && c === 2;
          return (
            <g
              key={`${r}${c}`}
              transform={`translate(${34 + c * 46} ${22 + r * 54})`}
            >
              <rect
                x="0"
                y="4"
                width="38"
                height="46"
                rx="6"
                fill={center ? "#8f2a1e" : "#1f6b49"}
              />
              <rect
                x="0"
                y="0"
                width="38"
                height="46"
                rx="6"
                fill={center ? "#c8402d" : "#fbf6ea"}
                stroke={lit ? "#d9a520" : "#d8cdb4"}
                strokeWidth={lit ? 3 : 1}
              />
              {center ? (
                <text
                  x="19"
                  y="31"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill="#fbf6ea"
                >
                  抽
                </text>
              ) : (
                <text
                  x="19"
                  y="30"
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="900"
                  fill={["#c8402d", "#1f6b49", "#23395d"][(r * 3 + c) % 3]}
                >
                  {["東", "南", "西", "北", "", "發", "白", "萬", "筒"][r * 3 + c]}
                </text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}

export function PomodoroArt({ className }: { className?: string }) {
  // 番茄 + 刻度圓環
  const ticks = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle
        cx="100"
        cy="104"
        r="80"
        fill="none"
        stroke="#d8cdb4"
        strokeWidth="1"
      />
      {ticks.map((_, i) => {
        const a = (i / ticks.length) * Math.PI * 2;
        const long = i % 6 === 0;
        const r1 = long ? 68 : 72;
        return (
          <line
            key={i}
            x1={100 + Math.sin(a) * r1}
            y1={104 - Math.cos(a) * r1}
            x2={100 + Math.sin(a) * 77}
            y2={104 - Math.cos(a) * 77}
            stroke={long ? "#b8923a" : "#cbbf9f"}
            strokeWidth={long ? 2 : 1}
          />
        );
      })}
      {/* 進度弧 */}
      <path
        d="M100 24 A80 80 0 0 1 169.3 144"
        fill="none"
        stroke="#c8402d"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* 番茄 */}
      <ellipse cx="100" cy="112" rx="44" ry="38" fill="#c8402d" />
      <ellipse
        cx="84"
        cy="98"
        rx="12"
        ry="7"
        fill="#fff"
        opacity="0.25"
        transform="rotate(-25 84 98)"
      />
      <path
        d="M100 76 l-14 -8 l10 12 l-18 2 l18 4 M100 76 l14 -8 l-10 12 l18 2 l-18 4"
        fill="#1f6b49"
        stroke="#1f6b49"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M100 76 q2 -12 10 -16"
        fill="none"
        stroke="#1f6b49"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FortuneArt({ className }: { className?: string }) {
  // 籤筒 + 飛出的籤
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g transform="rotate(-14 100 150)">
        {[70, 84, 98, 112, 126].map((x, i) => (
          <g key={x} transform={`rotate(${(i - 2) * 6} ${x} 120)`}>
            <rect
              x={x - 3}
              y={i === 2 ? 22 : 52}
              width="6"
              height={i === 2 ? 100 : 70}
              rx="2"
              fill="#e2c48a"
            />
            <rect
              x={x - 3}
              y={i === 2 ? 22 : 52}
              width="6"
              height="10"
              rx="2"
              fill="#c8402d"
            />
          </g>
        ))}
        <rect x="58" y="96" width="84" height="92" rx="10" fill="#c8402d" />
        <rect x="54" y="104" width="92" height="8" rx="4" fill="#d9a520" />
        <rect x="54" y="168" width="92" height="8" rx="4" fill="#d9a520" />
        <text
          x="100"
          y="150"
          textAnchor="middle"
          fontSize="28"
          fontWeight="900"
          fill="#fbf6ea"
        >
          籤
        </text>
      </g>
      {/* 籤紙 */}
      <g transform="rotate(10 160 70)">
        <rect
          x="142"
          y="20"
          width="36"
          height="96"
          rx="3"
          fill="#fbf6ea"
          stroke="#c8402d"
          strokeWidth="2"
        />
        <text
          x="160"
          y="54"
          textAnchor="middle"
          fontSize="20"
          fontWeight="900"
          fill="#c8402d"
        >
          大
        </text>
        <text
          x="160"
          y="80"
          textAnchor="middle"
          fontSize="20"
          fontWeight="900"
          fill="#c8402d"
        >
          吉
        </text>
        <line
          x1="150"
          y1="92"
          x2="170"
          y2="92"
          stroke="#c8402d"
          strokeWidth="1"
        />
        <line
          x1="150"
          y1="98"
          x2="170"
          y2="98"
          stroke="#c8402d"
          strokeWidth="1"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

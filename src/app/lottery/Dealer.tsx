/**
 * 原創荷官角色（純 SVG 手繪，無版權疑慮）
 * 酷御姐風：金色盤髮、紫色鳳眼、白色無袖高領襯衫、黑色綁帶與馬甲、紅色內裡黑大衣、金色點綴
 */

/** 荷官狀態：idle 待機、spinning 抽獎中、win 開獎 */
export type DealerMood = "idle" | "spinning" | "win";

const LASH = "#2b1d14";
const HAIR_LINE = "#a8771c";
const SKIN_SHADE = "#f2c4a8";

/** 一隻眼睛。side = -1 左眼（畫面左）、1 右眼 */
function Eye({
  cx,
  cy,
  side,
  mood,
  wink,
}: {
  cx: number;
  cy: number;
  side: -1 | 1;
  mood: DealerMood;
  wink: boolean;
}) {
  const outer = cx + side * 16; // 眼尾
  const inner = cx - side * 13; // 眼頭

  if (wink) {
    // 眨眼：一道帶眼尾上揚的弧線
    return (
      <g>
        <path
          d={`M ${inner} ${cy + 1} Q ${cx} ${cy + 7} ${outer} ${cy - 3}`}
          fill="none"
          stroke={LASH}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
        <path
          d={`M ${outer} ${cy - 3} l ${side * 5} -4`}
          stroke={LASH}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      </g>
    );
  }

  // 鳳眼：眼尾上揚、上眼瞼壓低（半瞇的冷豔眼神）
  const white = `M ${inner} ${cy + 1}
    Q ${cx - side * 2} ${cy - 8} ${outer} ${cy - 6}
    Q ${cx + side * 8} ${cy + 8} ${cx} ${cy + 8}
    Q ${cx - side * 9} ${cy + 7} ${inner} ${cy + 1} Z`;
  // 抽獎中眼珠往左瞄向九宮格
  const look = mood === "spinning" ? -4 : 0;
  const id = `eye-${side}`;

  return (
    <g>
      <clipPath id={id}>
        <path d={white} />
      </clipPath>
      <path d={white} fill="#fdfaf7" />
      <g clipPath={`url(#${id})`}>
        <ellipse
          cx={cx + look}
          cy={cy + 1}
          rx={8}
          ry={10}
          fill="url(#dealer-iris)"
        />
        <ellipse cx={cx + look} cy={cy + 2} rx={3.6} ry={5.2} fill="#1a0833" />
        <circle cx={cx + look + 3} cy={cy - 2} r={2.6} fill="#fff" />
        <circle
          cx={cx + look - 2.5}
          cy={cy + 5}
          r={1.2}
          fill="#fff"
          opacity={0.85}
        />
        {/* 上眼瞼陰影，讓眼神更有壓迫感 */}
        <path
          d={`M ${inner - 4} ${cy - 10} L ${outer + 4} ${cy - 10} L ${outer + 4} ${cy - 3} Q ${cx} ${cy - 4} ${inner - 4} ${cy + 1} Z`}
          fill="#6b4a3a"
          opacity={0.28}
        />
      </g>
      {/* 上睫毛：粗、眼尾拉長上揚 */}
      <path
        d={`M ${inner - 1} ${cy + 1} Q ${cx - side * 2} ${cy - 9} ${outer + side * 1} ${cy - 6.5}`}
        fill="none"
        stroke={LASH}
        strokeWidth={3.6}
        strokeLinecap="round"
      />
      <path
        d={`M ${outer} ${cy - 6} q ${side * 5} -1 ${side * 8} -6`}
        fill="none"
        stroke={LASH}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d={`M ${outer - side * 2} ${cy - 4} l ${side * 6} 1`}
        stroke={LASH}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* 下睫毛（淡） */}
      <path
        d={`M ${outer - side * 1} ${cy - 2} Q ${cx + side * 6} ${cy + 9} ${cx - side * 3} ${cy + 8.5}`}
        fill="none"
        stroke="#8a5a44"
        strokeWidth={1.1}
        opacity={0.7}
      />
      {/* 雙眼皮線 */}
      <path
        d={`M ${inner + side * 2} ${cy - 6} Q ${cx} ${cy - 13} ${outer - side * 1} ${cy - 11}`}
        fill="none"
        stroke="#c78f74"
        strokeWidth={1}
      />
    </g>
  );
}

/** 閃光星芒 */
function Sparkle({
  x,
  y,
  s,
  delay,
}: {
  x: number;
  y: number;
  s: number;
  delay: number;
}) {
  return (
    <path
      className="mj-twinkle"
      style={{ animationDelay: `${delay}s` }}
      d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
      fill="#fff7d1"
    />
  );
}

export default function Dealer({ mood }: { mood: DealerMood }) {
  return (
    <div
      className={["mj-dealer-card", mood === "win" ? "mj-dealer-win" : ""].join(
        " ",
      )}
    >
      <svg
        viewBox="0 0 340 400"
        className="block h-auto w-full"
        role="img"
        aria-label="荷官"
      >
        <defs>
          <linearGradient id="dealer-hair" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#fff6c9" />
            <stop offset="35%" stopColor="#f4cf5d" />
            <stop offset="100%" stopColor="#c48f22" />
          </linearGradient>
          <linearGradient id="dealer-hair-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9a93a" />
            <stop offset="100%" stopColor="#9c6f16" />
          </linearGradient>
          <linearGradient id="dealer-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3ea" />
            <stop offset="100%" stopColor="#fbdcc8" />
          </linearGradient>
          <linearGradient id="dealer-iris" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
          <linearGradient id="dealer-shirt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#dfe4ee" />
          </linearGradient>
          <linearGradient id="dealer-coat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c2433" />
            <stop offset="100%" stopColor="#0d0a10" />
          </linearGradient>
          <linearGradient id="dealer-lining" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b3203a" />
            <stop offset="100%" stopColor="#4d0a16" />
          </linearGradient>
          <linearGradient id="dealer-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff2a8" />
            <stop offset="50%" stopColor="#d9a520" />
            <stop offset="100%" stopColor="#8a6510" />
          </linearGradient>
          <radialGradient id="dealer-aura" cx="0.5" cy="0.45" r="0.5">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* 背後金色光暈 */}
        <ellipse cx={170} cy={170} rx={160} ry={170} fill="url(#dealer-aura)" />

        {/* ===== 大衣（背面）：黑色外層 + 紅色內裡 ===== */}
        <path
          d="M 96 236 C 58 262 30 330 8 400 L 332 400 C 312 330 284 262 244 236 Z"
          fill="url(#dealer-coat)"
        />
        <path
          d="M 104 248 C 76 280 58 336 46 400 L 294 400 C 282 336 264 280 236 248 Z"
          fill="url(#dealer-lining)"
        />

        {/* ===== 後髮 ===== */}
        <path
          d="M 110 124 C 96 60 244 58 230 124 C 242 172 242 218 230 250 C 206 258 134 258 110 250 C 98 218 98 172 110 124 Z"
          fill="url(#dealer-hair-back)"
        />

        {/* ===== 身體 ===== */}
        {/* 脖子 */}
        <path
          d="M 156 176 L 155 224 Q 170 234 185 224 L 184 176 Z"
          fill={SKIN_SHADE}
        />
        {/* 肩膀與手臂（無袖） */}
        <path
          d="M 152 214 C 122 218 100 226 90 250 C 80 284 82 336 86 400 L 254 400 C 258 336 260 284 250 250 C 240 226 218 218 188 214 Z"
          fill="url(#dealer-skin)"
        />
        {/* 鎖骨 */}
        <path
          d="M 132 232 Q 146 236 158 232 M 182 232 Q 194 236 208 232"
          fill="none"
          stroke={SKIN_SHADE}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        {/* 手臂內側陰影 */}
        <path
          d="M 112 260 C 108 300 108 350 110 400 L 98 400 C 96 350 98 300 104 262 Z M 228 260 C 232 300 232 350 230 400 L 242 400 C 244 350 242 300 236 262 Z"
          fill={SKIN_SHADE}
          opacity={0.7}
        />

        {/* 白色無袖高領襯衫 */}
        <path
          d="M 130 236 C 142 228 156 226 170 230 C 184 226 198 228 210 236 C 222 266 226 310 222 400 L 118 400 C 114 310 118 266 130 236 Z"
          fill="url(#dealer-shirt)"
        />
        {/* 襯衫皺褶 */}
        <path
          d="M 150 262 Q 146 286 150 306 M 192 262 Q 196 284 192 304 M 170 250 L 170 300"
          fill="none"
          stroke="#c5cdda"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
        {/* 高領 */}
        <path
          d="M 152 210 L 134 238 L 168 244 Z M 188 210 L 206 238 L 172 244 Z"
          fill="#ffffff"
          stroke="#cfd6e2"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />

        {/* 黑色綁帶（交叉） */}
        <path
          d="M 134 238 L 198 304 M 206 238 L 142 304"
          stroke="#16111b"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <rect
          x={163}
          y={265}
          width={14}
          height={10}
          rx={2}
          fill="none"
          stroke="url(#dealer-gold)"
          strokeWidth={2.5}
        />

        {/* 黑色馬甲 + 金邊 */}
        <path
          d="M 118 304 C 142 294 198 294 222 304 L 226 400 L 114 400 Z"
          fill="url(#dealer-coat)"
        />
        <path
          d="M 118 304 C 142 294 198 294 222 304"
          fill="none"
          stroke="url(#dealer-gold)"
          strokeWidth={2.5}
        />
        <path d="M 170 300 L 170 400" stroke="#3a3040" strokeWidth={1.5} />
        {[324, 350, 376].map((y) => (
          <g key={y}>
            <circle cx={162} cy={y} r={3.2} fill="url(#dealer-gold)" />
            <circle cx={178} cy={y} r={3.2} fill="url(#dealer-gold)" />
          </g>
        ))}

        {/* 金色領結緞帶 */}
        <path
          d="M 170 244 L 154 235 L 155 253 Z M 170 244 L 186 235 L 185 253 Z"
          fill="url(#dealer-gold)"
        />
        <path
          d="M 166 248 L 156 294 L 166 287 Z M 174 248 L 188 292 L 177 286 Z"
          fill="url(#dealer-gold)"
          opacity={0.92}
        />
        <circle cx={170} cy={244} r={4.5} fill="#b8860b" />

        {/* 項圈 choker + 寶石 */}
        <path
          d="M 155 202 Q 170 210 185 202 L 185 210 Q 170 218 155 210 Z"
          fill="#16111b"
        />
        <path d="M 170 209 l 4 5 l -4 5 l -4 -5 Z" fill="url(#dealer-gold)" />

        {/* ===== 大衣（前方，滑落到手臂上，露肩） ===== */}
        <path
          d="M 102 244 C 84 252 76 270 70 298 C 62 336 58 372 54 400 L 106 400 C 103 362 104 322 110 292 C 114 272 112 256 102 244 Z"
          fill="url(#dealer-coat)"
        />
        <path
          d="M 102 244 C 112 256 114 272 110 292 C 104 322 103 362 106 400 L 98 400 C 96 360 97 322 102 292 C 106 272 104 258 96 248 Z"
          fill="url(#dealer-lining)"
        />
        <path
          d="M 238 244 C 256 252 264 270 270 298 C 278 336 282 372 286 400 L 234 400 C 237 362 236 322 230 292 C 226 272 228 256 238 244 Z"
          fill="url(#dealer-coat)"
        />
        <path
          d="M 238 244 C 228 256 226 272 230 292 C 236 322 237 362 234 400 L 242 400 C 244 360 243 322 238 292 C 234 272 236 258 244 248 Z"
          fill="url(#dealer-lining)"
        />
        {/* 大衣金色滾邊 */}
        <path
          d="M 102 244 C 84 252 76 270 70 298 C 62 336 58 372 54 400 M 238 244 C 256 252 264 270 270 298 C 278 336 282 372 286 400"
          fill="none"
          stroke="url(#dealer-gold)"
          strokeWidth={2}
          opacity={0.9}
        />

        {/* ===== 右手：黑色長手套，指間夾著一張紅中 ===== */}
        <path
          d="M 246 400 C 250 360 258 320 262 290 C 264 274 258 262 248 256 L 238 262 C 244 276 246 290 244 306 C 240 336 234 368 232 400 Z"
          fill="#16111b"
        />
        <path
          d="M 232 244 C 228 232 236 222 248 222 C 260 222 264 234 260 246 C 256 258 238 260 232 244 Z"
          fill="#16111b"
        />
        <path
          d="M 238 230 L 236 214 M 245 227 L 245 210 M 252 228 L 254 212"
          stroke="#16111b"
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* 手套光澤 + 金色袖口 + 戒指 */}
        <path
          d="M 236 236 Q 244 228 254 232 M 237 222 L 236 216 M 245 220 L 245 213 M 252 221 L 253 215 M 252 290 C 250 320 246 350 242 380"
          fill="none"
          stroke="#5a4d66"
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.9}
        />
        <path
          d="M 240 258 C 246 262 254 262 260 256"
          fill="none"
          stroke="url(#dealer-gold)"
          strokeWidth={2.5}
        />
        <circle
          cx={245}
          cy={224}
          r={3.2}
          fill="none"
          stroke="url(#dealer-gold)"
          strokeWidth={1.8}
        />
        <g transform="rotate(14 248 196)">
          <rect x={235} y={178} width={26} height={34} rx={4} fill="#1f7a4d" />
          <rect x={235} y={176} width={26} height={32} rx={4} fill="#fffdf6" />
          <text
            x={248}
            y={199}
            fontSize={19}
            fontWeight={900}
            fill="#b91c1c"
            textAnchor="middle"
          >
            中
          </text>
        </g>

        {/* ===== 頭部（微微側傾，更自然） ===== */}
        <g transform="rotate(-5 170 200)">
          {/* 耳朵 + 金色耳墜 */}
          <ellipse cx={116} cy={142} rx={7} ry={12} fill={SKIN_SHADE} />
          <path
            d="M 116 154 L 116 162"
            stroke="url(#dealer-gold)"
            strokeWidth={1.5}
          />
          <path d="M 116 162 l 4 7 l -4 7 l -4 -7 Z" fill="url(#dealer-gold)" />

          {/* 臉：略尖的下巴，成熟的臉型 */}
          <path
            d="M 116 118 C 114 80 226 80 224 118 C 224 156 204 186 170 196 C 136 186 116 156 116 118 Z"
            fill="url(#dealer-skin)"
          />
          {/* 瀏海下的陰影 */}
          <path
            d="M 118 118 C 140 108 200 108 222 118 C 220 126 216 132 212 136 C 190 122 150 122 126 136 C 122 130 119 124 118 118 Z"
            fill={SKIN_SHADE}
            opacity={0.55}
          />

          {/* 眉毛：細長、眉尾微揚 */}
          <path
            d="M 134 117 Q 146 110 160 114"
            fill="none"
            stroke={HAIR_LINE}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <path
            d="M 180 114 Q 194 109 207 115"
            fill="none"
            stroke={HAIR_LINE}
            strokeWidth={2.2}
            strokeLinecap="round"
          />

          {/* 眼睛：開獎時右眼眨眼 */}
          <Eye cx={147} cy={138} side={-1} mood={mood} wink={false} />
          <Eye cx={194} cy={138} side={1} mood={mood} wink={mood === "win"} />

          {/* 鼻子 */}
          <path
            d="M 172 156 Q 175 163 170 166"
            fill="none"
            stroke="#dd9f84"
            strokeWidth={1.4}
            strokeLinecap="round"
          />

          {/* 嘴巴 */}
          {mood === "win" ? (
            // 自信的笑
            <g>
              <path
                d="M 160 175 Q 172 188 184 174 Q 172 179 160 175 Z"
                fill="#a3203a"
              />
              <path
                d="M 163 177 Q 172 180 181 176 L 181 177 Q 172 182 163 178 Z"
                fill="#fff"
              />
            </g>
          ) : mood === "spinning" ? (
            // 嘴角一邊上揚的壞笑
            <path
              d="M 162 178 Q 172 181 183 172"
              fill="none"
              stroke="#b4233c"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          ) : (
            // 冷淡的淺笑，紅唇
            <g>
              <path
                d="M 162 176 Q 172 173 182 175 Q 172 182 162 176 Z"
                fill="#c0263f"
              />
              <path
                d="M 166 179 Q 172 180.5 178 178.5"
                stroke="#fff"
                strokeWidth={0.9}
                opacity={0.6}
                fill="none"
              />
            </g>
          )}

          {/* 淡淡的腮紅 */}
          <ellipse
            cx={138}
            cy={160}
            rx={9}
            ry={3.5}
            fill="#f9a8b4"
            opacity={0.16}
          />
          <ellipse
            cx={204}
            cy={160}
            rx={9}
            ry={3.5}
            fill="#f9a8b4"
            opacity={0.16}
          />

          {/* ===== 前髮 ===== */}
          {/* 盤髮髮髻 + 金色髮簪 */}
          <circle cx={124} cy={80} r={24} fill="url(#dealer-hair)" />
          <path
            d="M 106 72 Q 124 60 142 74 M 104 84 Q 124 72 144 88 M 110 96 Q 126 86 140 98"
            fill="none"
            stroke={HAIR_LINE}
            strokeWidth={1.4}
            opacity={0.7}
          />
          <path
            d="M 96 52 L 150 104"
            stroke="url(#dealer-gold)"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
          <circle
            cx={96}
            cy={52}
            r={5}
            fill="#b91c1c"
            stroke="url(#dealer-gold)"
            strokeWidth={2}
          />
          <path
            d="M 96 58 L 92 72 M 96 58 L 100 72"
            stroke="url(#dealer-gold)"
            strokeWidth={1.2}
          />
          <circle cx={92} cy={74} r={2} fill="url(#dealer-gold)" />
          <circle cx={100} cy={74} r={2} fill="url(#dealer-gold)" />

          {/* 頭頂與側分瀏海（遮住一點右眼，更有神秘感） */}
          <path
            d="M 110 130 C 100 72 150 52 196 60 C 236 68 246 108 234 148 C 230 128 222 110 212 102 C 216 124 210 146 200 160 C 200 138 194 118 184 106 C 178 124 166 134 150 140 C 158 124 158 110 154 100 C 142 112 128 122 110 130 Z"
            fill="url(#dealer-hair)"
          />
          {/* 髮絲線條 */}
          <path
            d="M 158 66 C 168 80 178 94 184 106 M 186 62 C 200 76 208 88 212 102 M 204 66 C 222 84 230 104 232 132 M 140 76 C 146 84 151 92 154 100 M 120 112 C 116 98 120 84 132 74"
            fill="none"
            stroke={HAIR_LINE}
            strokeWidth={1.1}
            strokeLinecap="round"
            opacity={0.45}
          />
          {/* 側邊長髮束 */}
          <path
            d="M 118 116 C 104 146 104 186 114 222 C 120 202 124 172 126 144 Z"
            fill="url(#dealer-hair)"
          />
          <path
            d="M 228 112 C 244 146 246 194 234 236 C 226 210 222 176 220 144 Z"
            fill="url(#dealer-hair)"
          />
          {/* 呆毛 */}
          <path
            d="M 176 62 C 186 38 208 38 214 48 C 200 46 190 52 184 64 Z"
            fill="url(#dealer-hair)"
          />
          {/* 頭髮光澤 */}
          <path
            d="M 138 84 Q 170 66 210 80"
            fill="none"
            stroke="#fff"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.45}
          />
          <path
            d="M 150 92 Q 176 80 202 90"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.35}
          />
        </g>

        {/* 閃光星芒（華麗感） */}
        <Sparkle x={58} y={110} s={9} delay={0} />
        <Sparkle x={288} y={86} s={11} delay={0.7} />
        <Sparkle x={300} y={196} s={7} delay={1.3} />
        <Sparkle x={44} y={210} s={6} delay={1.9} />
      </svg>
    </div>
  );
}

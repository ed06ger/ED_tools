import Link from "next/link";

/** 各工具頁左上角的「回工具箱」連結，顏色由 className 依頁面主題調整 */
export default function BackHome({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-bold tracking-widest transition ${className}`}
    >
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        ←
      </span>
      回工具箱
    </Link>
  );
}

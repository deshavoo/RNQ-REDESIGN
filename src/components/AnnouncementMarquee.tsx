import type * as React from "react";
import type { ReactNode } from "react";
import { BadgeCheck, MapPin, PartyPopper, Gift, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GOLD } from "./theme";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface MarqueeItem {
  text: string;
  icon?: LucideIcon;
  /** لو موجود، النص بيتحول لرابط */
  href?: string;
}

export interface AnnouncementMarqueeProps {
  items?: MarqueeItem[];
  /** مدة اللفة الكاملة بالثواني: كل ما زادت كل ما كان أبطأ */
  duration?: number;
  /** يعكس اتجاه الحركة */
  reverse?: boolean;
  /** عدد مرات تكرار القائمة في كل نصف (زوّده لو القائمة قصيرة والشاشة عريضة) */
  repeat?: number;
  /** وصف للقارئات الصوتية */
  ariaLabel?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Defaults (نصوص مؤقتة: عدّلها بالنصوص المعتمدة)                       */
/* ------------------------------------------------------------------ */

const DEFAULT_ITEMS: MarqueeItem[] = [
  { text: "وكيل معتمد لقهوة بارنيز", icon: BadgeCheck },
  { text: "وكيل معتمد لحلويات سعد الدين", icon: BadgeCheck },
  { text: "صُنع في السعودية", icon: MapPin },
  { text: "نجهّز طلباتك لكل المناسبات", icon: PartyPopper },
  { text: "هدايا وضيافة للشركات", icon: Gift },
  { text: "طلبات خاصة حسب الطلب", icon: Sparkles },
];


/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

function Entry({ item, primary }: { item: MarqueeItem; primary: boolean }) {
  const Icon = item.icon;
  const content: ReactNode = (
    <>
      {Icon && <Icon size={15} strokeWidth={1.8} className="shrink-0 text-[#d4af37]" aria-hidden />}
      <span>{item.text}</span>
    </>
  );
  const base = "inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-white/90";

  return (
    <li dir="rtl" aria-hidden={!primary} className="flex shrink-0 items-center gap-10 ps-10">
      {item.href ? (
        <a
          href={item.href}
          tabIndex={primary ? undefined : -1}
          className={`${base} transition-colors hover:text-[#d4af37] focus:outline-none focus-visible:text-[#d4af37]`}
        >
          {content}
        </a>
      ) : (
        <span className={base}>{content}</span>
      )}
      {/* gold diamond separator */}
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#d4af37]" />
    </li>
  );
}

export default function AnnouncementMarquee({
  items = DEFAULT_ITEMS,
  duration = 45,
  reverse = false,
  repeat = 3,
  ariaLabel = "مميزات المجموعة",
  className = "",
}: AnnouncementMarqueeProps) {
  // one "half" = the list repeated; the track renders two identical halves for a seamless loop
  // only the very first copy is announced and focusable; every other copy is decoration
  const makeHalf = (isFirstHalf: boolean) =>
    Array.from({ length: repeat }, (_, r) =>
      items.map((item, i) => (
        <Entry key={`${isFirstHalf ? "a" : "b"}-${r}-${i}`} item={item} primary={isFirstHalf && r === 0} />
      ))
    );

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`rnq-marquee relative w-full overflow-hidden bg-black text-white motion-reduce:overflow-x-auto ${className}`}
    >
      <style>{`
        @keyframes rnq-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .rnq-marquee-track { animation: rnq-marquee var(--rnq-duration, 45s) linear infinite }
        .rnq-marquee:hover .rnq-marquee-track,
        .rnq-marquee:focus-within .rnq-marquee-track { animation-play-state: paused }
        @media (prefers-reduced-motion: reduce) { .rnq-marquee-track { animation: none } }
      `}</style>

      {/* LTR on purpose: keeps the translateX math simple; each item sets its own RTL */}
      <div
        dir="ltr"
        className="h-10 mask-[linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
      >
        <ul
          className="rnq-marquee-track flex h-full w-max items-center"
          style={
            {
              "--rnq-duration": `${duration}s`,
              animationDirection: reverse ? "reverse" : "normal",
            } as React.CSSProperties
          }
        >
          {makeHalf(true)}
          {makeHalf(false)}
        </ul>
      </div>

      {/* gold hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ backgroundImage: `linear-gradient(90deg,transparent,${GOLD}aa,transparent)` }}
      />
    </div>
  );
}

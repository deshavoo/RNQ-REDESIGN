import type * as React from "react";
import type { ReactNode } from "react";
import { BadgeCheck, MapPin, PartyPopper, Gift, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BRAND } from "./theme";

export interface MarqueeItem {
  text: string;
  icon?: LucideIcon;
  href?: string;
}

export interface AnnouncementMarqueeProps {
  items?: MarqueeItem[];
  duration?: number;
  reverse?: boolean;
  repeat?: number;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: MarqueeItem[] = [
  { text: "وكيل معتمد لقهوة بارنيز", icon: BadgeCheck },
  { text: "وكيل معتمد لحلويات سعد الدين", icon: BadgeCheck },
  { text: "صُنع في السعودية", icon: MapPin },
  { text: "نجهّز طلباتك لكل المناسبات", icon: PartyPopper },
  { text: "هدايا وضيافة للشركات", icon: Gift },
  { text: "طلبات خاصة حسب الطلب", icon: Sparkles },
];

function Entry({ item, primary }: { item: MarqueeItem; primary: boolean }) {
  const Icon = item.icon;
  const content: ReactNode = (
    <>
      {Icon && <Icon size={15} strokeWidth={1.8} className="shrink-0 text-brand-soft" aria-hidden />}
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
          className={`${base} transition-colors hover:text-brand-soft focus:outline-none focus-visible:text-brand-soft`}
        >
          {content}
        </a>
      ) : (
        <span className={base}>{content}</span>
      )}
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-soft" />
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
      className={`rnq-marquee relative w-full overflow-hidden bg-brand text-white motion-reduce:overflow-x-auto ${className}`}
    >
      <style>{`
        @keyframes rnq-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .rnq-marquee-track { animation: rnq-marquee var(--rnq-duration, 45s) linear infinite }
        .rnq-marquee:hover .rnq-marquee-track,
        .rnq-marquee:focus-within .rnq-marquee-track { animation-play-state: paused }
        @media (prefers-reduced-motion: reduce) { .rnq-marquee-track { animation: none } }
      `}</style>

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

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ backgroundImage: `linear-gradient(90deg,transparent,${BRAND}aa,transparent)` }}
      />
    </div>
  );
}

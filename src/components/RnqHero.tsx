"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { GOLD, goldFill } from "./theme";

const goldBorder =
  "linear-gradient(135deg,rgba(245,227,161,.95),rgba(212,175,55,.55) 45%,rgba(138,106,31,.85))";

export type HeroSlide =
  | { type: "image"; src: string; alt: string; fit?: SlideFit;  position?: string }
  | { type: "video"; src: string; alt: string; fit?: SlideFit; poster?: string; position?: string };

export type SlideFit = "contain" | "cover";
const isContain = (slide: { fit?: SlideFit }) => slide.fit === "contain";
const DEFAULT_SLIDES: HeroSlide[] = [
  { type: "image", src: "/images/hero-1.png", alt: "مجموعة RNQ للتجارة: قهوة بارنيز وحلويات سعد الدين", position: "50% 45%" },
  { type: "image", src: "/images/hero-2.png", alt: "قهوة بارنيز المختصة" },
  { type: "image", src: "/images/hero-3.png", alt: "حلويات وتمور سعد الدين" },
  { type: "video", src: "/videos/hero.mp4", alt: "فيديو تعريفي بمجموعة RNQ" },
];
const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const CoffeeIcon = () => (
  <svg {...iconProps}>
    <path d="M4 10h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-4Z" />
    <path d="M17 11.5h1.5a2.5 2.5 0 0 1 0 5H16.5" />
    <path d="M8 3.5c-.9 1 .9 1.8 0 2.8M12 3.5c-.9 1 .9 1.8 0 2.8" />
  </svg>
);

const SweetIcon = () => (
  <svg {...iconProps}>
    <rect x="7" y="8" width="10" height="8" rx="4" />
    <path d="M7 10.5 3.5 8.5v7L7 13.5M17 10.5l3.5-2v7l-3.5-2" />
    <path d="M10.5 11.5h3" />
  </svg>
);

const ArrowIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

const ctas = [
  { href: "/products/barns", target: "barns", label: "تصفح منتجات بارنيز", Icon: CoffeeIcon },
  { href: "/products/saadeddin", target: "saadeddin", label: "تصفح منتجات سعد الدين", Icon: SweetIcon },
];

function scrollToSection(e: MouseEvent<HTMLAnchorElement>, target: string) {
  const el = document.getElementById(target);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${target}`);
}

interface RnqHeroProps {
  slides?: HeroSlide[];
  interval?: number;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerReducedMotion = () => false;

const glassBtn =
  "flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/60 bg-black/35 text-white backdrop-blur-md transition-colors duration-300 hover:border-transparent hover:bg-[#d4af37] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

export default function RnqHero({ slides = DEFAULT_SLIDES, interval = 6000 }: RnqHeroProps) {
  const count = slides.length;
  const hasMany = count > 1;
  const [index, setIndex] = useState(0);
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const [isHeld, setIsHeld] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const fillRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const elapsedRef = useRef(0);
  const pointerStartX = useRef<number | null>(null);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion
  );
  const isPlaying = userPlaying ?? !prefersReducedMotion;
  useEffect(() => {
    elapsedRef.current = 0;
    Object.values(fillRefs.current).forEach((el) => {
      if (el) el.style.transform = "scaleX(0)";
    });
  }, [index]);

  useEffect(() => {
    if (!hasMany || !isPlaying || isHeld || slides[index]?.type === "video") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      const p = Math.min(elapsedRef.current / interval, 1);
      const el = fillRefs.current[index];
      if (el) el.style.transform = `scaleX(${p})`;
      if (p >= 1) {
        goNext();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, isPlaying, isHeld, interval, hasMany, slides, goNext]);

  useEffect(() => {
    slides.forEach((_, i) => {
      const v = videoRefs.current[i];
      if (!v) return;
      if (i === index) {
        if (isPlaying) v.play().catch(() => { });
        else v.pause();
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [index, isPlaying, slides]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goPrev();
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) goNext();
    else goPrev();
  };

  const current = slides[index];

  return (
    <section
      dir="rtl"
      lang="ar"
      aria-labelledby="rnq-title"
      className="relative isolate flex w-full flex-col items-center overflow-hidden bg-white pb-10 text-black sm:pb-14"
    >
      <style>{`
        @keyframes rnq-fade { from { opacity: 0 } to { opacity: 1 } }
        .rnq-fade { animation: rnq-fade 1s ease-out both }
        @media (prefers-reduced-motion: reduce) { .rnq-fade { animation: none } }
      `}</style>

      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute bottom-0 left-1/2 h-[45vmin] w-[110vmin] -translate-x-1/2 translate-y-1/3 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side,rgba(245,227,161,.5),rgba(212,175,55,.12) 55%,transparent 75%)",
          }}
        />
      </div>

      <h1 id="rnq-title" className="sr-only">
        مجموعة RNQ للتجارة
      </h1>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="معرض المجموعة"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setIsHeld(true)}
        onMouseLeave={() => setIsHeld(false)}
        onFocus={() => setIsHeld(true)}
        onBlur={() => setIsHeld(false)}
        onPointerDown={(e) => {
          pointerStartX.current = e.clientX;
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
        className="rnq-fade relative aspect-4/3 w-full touch-pan-y overflow-hidden bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold sm:aspect-auto sm:h-[min(56.25vw,calc(100svh-7.5rem))]"
      >
        <div
          aria-live={isPlaying ? "off" : "polite"}
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,.8,.3,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={`${slide.type}-${slide.src}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} من ${count}`}
              aria-hidden={i !== index}
              className="relative h-full w-full shrink-0"
            >
              {slide.type === "image" ? (
                <>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    preload={i === 0}
                    sizes="100vw"
                    draggable={false}
                    className={`select-none ${isContain(slide) ? "object-contain" : "object-cover"}`}
                    style={{ objectPosition: slide.position ?? "50% 50%" }}
                  />
                </>
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={slide.src}
                  poster={slide.poster}
                  aria-label={slide.alt}
                  muted={isMuted}
                  playsInline
                  loop={!hasMany}
                  preload="metadata"
                  onEnded={() => {
                    if (isPlaying && hasMany) goNext();
                  }}
                  onError={() => {
                    if (isPlaying && hasMany && i === index) goNext();
                  }}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    const el = fillRefs.current[i];
                    if (el && v.duration) el.style.transform = `scaleX(${v.currentTime / v.duration})`;
                  }}
                  className={`absolute inset-0 h-full w-full select-none ${isContain(slide) ? "object-contain" : "object-cover"}`}
                  style={{ objectPosition: slide.position ?? "50% 50%" }}
                />
              )}
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/60 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ backgroundImage: `linear-gradient(90deg,transparent,${GOLD},transparent)` }}
        />

        {hasMany && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="الشريحة السابقة"
              className={`${glassBtn} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex lg:right-6`}
            >
              <ChevronRight size={22} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="الشريحة التالية"
              className={`${glassBtn} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 sm:flex lg:left-6`}
            >
              <ChevronLeft size={22} />
            </button>
            <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-1.5 sm:bottom-6">
              {slides.map((slide, i) => (
                <button
                  key={`ind-${slide.src}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`الانتقال إلى الشريحة ${i + 1}`}
                  aria-current={i === index}
                  className="flex h-6 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span
                    className={`relative block h-0.75 overflow-hidden rounded-full transition-all duration-500 ${i === index ? "w-14 bg-white/55 sm:w-20" : "w-6 bg-white/30 sm:w-8"
                      }`}
                  >
                    <span
                      ref={(el) => {
                        fillRefs.current[i] = el;
                      }}
                      className="absolute inset-0 origin-right rounded-full"
                      style={{ backgroundImage: goldFill, transform: "scaleX(0)" }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="absolute bottom-3 left-3 z-10 flex gap-2 sm:bottom-5 sm:left-5">
          {current?.type === "video" && (
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
              aria-pressed={!isMuted}
              className={glassBtn}
            >
              {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </button>
          )}
          {hasMany && (
            <button
              type="button"
              onClick={() => setUserPlaying(!isPlaying)}
              aria-label={isPlaying ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
              className={glassBtn}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          )}
        </div>
      </div>
      <p
        className="mt-10 max-w-xl px-4 text-center text-lg leading-loose text-black/70 sm:text-xl"
      >
        قهوة مختصة وحلويات فاخرة، تصلك من الرياض بجودة تليق بضيافتك.
      </p>
      <div
        className="mt-8 flex w-full flex-col items-stretch gap-5 px-4 sm:w-auto sm:flex-row sm:items-center sm:gap-8 sm:px-0"
      >
        {ctas.map(({ href, target, label, Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={(e) => scrollToSection(e, target)}
            className="group relative inline-flex rounded-full p-px transition-shadow duration-500 hover:shadow-[0_0_44px_-6px_rgba(212,175,55,0.55)] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-black"
            style={{ backgroundImage: goldBorder }}
          >
            <span className="relative isolate flex w-full items-center gap-3 overflow-hidden rounded-full bg-black/90 px-7 py-4 text-base font-semibold text-white backdrop-blur-xl transition-colors duration-500 group-hover:text-black sm:px-9 sm:text-lg">
              <span
                aria-hidden
                className="absolute inset-0 -z-10 origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                style={{ backgroundImage: goldFill }}
              />
              <span className="text-gold transition-colors duration-500 group-hover:text-black">
                <Icon />
              </span>
              <span className="whitespace-nowrap">{label}</span>
              <span className="ms-auto opacity-60 transition-all duration-500 group-hover:-translate-x-1 group-hover:opacity-100 motion-reduce:transition-none">
                <ArrowIcon />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

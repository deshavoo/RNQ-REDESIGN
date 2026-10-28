"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Gift } from "lucide-react";
import { REGIONS, REGION_IDS } from "@/lib/regions";
import Flag from "./Flag";
import { setRegion, useRegion } from "./region-store";

export default function RegionPicker({ className = "" }: { className?: string }) {
    const region = useRegion();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    useEffect(() => {
        if (!open) return;
        const onPointer = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={rootRef} dir="rtl" className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={listId}
                aria-label={`التوصيل إلى ${REGIONS[region].name}، تغيير الدولة`}
                className="flex h-10 items-center gap-2 rounded-full border border-brand/20 px-3 text-sm font-semibold text-black/80 transition-colors duration-300 hover:border-brand/50 hover:bg-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
                <Flag region={region} />
                <span className="hidden flex-col items-start leading-none xl:flex">
                    <span className="text-[10px] font-medium text-black/50">التوصيل إلى</span>
                    <span className="mt-0.5 text-xs font-bold text-brand-deep">{REGIONS[region].name}</span>
                </span>
                <ChevronDown size={14} aria-hidden className={`text-black/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    id={listId}
                    className="absolute top-full z-70 mt-2 w-72 animate-fade-up rounded-2xl border border-brand/15 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] end-0"
                >
                    <p className="px-3 pb-2 pt-1.5 text-xs font-semibold text-black/50">اختر دولة التوصيل</p>
                    <ul role="listbox" aria-label="دولة التوصيل" className="space-y-1">
                        {REGION_IDS.map((id) => {
                            const r = REGIONS[id];
                            const active = id === region;
                            return (
                                <li key={id} role="option" aria-selected={active}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRegion(id);
                                            setOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${active ? "bg-brand/8" : "hover:bg-black/4"}`}
                                    >
                                        <Flag region={id} className="h-5 w-7" />
                                        <span className="flex-1">
                                            <span className="block text-sm font-bold text-black">{r.name}</span>
                                            <span className="block text-xs text-black/55">الأسعار بـ{r.currencyLabel}</span>
                                        </span>
                                        {active && <Check size={16} className="text-brand" aria-hidden />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mt-2 flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5 text-xs leading-relaxed text-brand-deep">
                        <Gift size={15} className="mt-0.5 shrink-0" aria-hidden />
                        تقدر تطلب من مصر لحبايبك في السعودية، أو من السعودية لحبايبك في مصر.
                    </p>
                </div>
            )}
        </div>
    );
}

export function RegionSegment({ className = "" }: { className?: string }) {
    const region = useRegion();
    return (
        <div dir="rtl" className={className}>
            <p className="mb-2 text-xs font-semibold text-black/55">التوصيل إلى</p>
            <div role="group" aria-label="دولة التوصيل" className="grid grid-cols-2 gap-2">
                {REGION_IDS.map((id) => {
                    const active = id === region;
                    return (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setRegion(id)}
                            className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${active ? "border-brand bg-brand text-white" : "border-black/15 text-black/75 hover:border-brand/50"}`}
                        >
                            <Flag region={id} />
                            {REGIONS[id].name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

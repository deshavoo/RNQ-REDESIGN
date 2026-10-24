"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import type { Product } from "./brands";

const goldFill = "linear-gradient(135deg,#f5e3a1,#d4af37 55%,#b8891f)";

export const formatPrice = (n: number) => `${n.toLocaleString("en-US")} ر.س`;

interface ProductCardProps {
    product: Product;
    /** حرف البراند اللي بيظهر لو المنتج مالوش صورة */
    mark: string;
    categoryLabel?: string;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product: p, mark, categoryLabel, onAddToCart }: ProductCardProps) {
    return (
        <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-[border-color,box-shadow] duration-300 hover:border-gold/60 hover:shadow-[0_18px_40px_-26px_rgba(138,106,31,0.55)]">
            <div className="relative aspect-square overflow-hidden bg-[#f6f1e4]">
                {p.image ? (
                    <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width:1280px) 22vw,(min-width:640px) 40vw,46vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                    />
                ) : (
                    <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center text-7xl font-semibold text-gold/45"
                        style={{
                            background:
                                "radial-gradient(ellipse at 70% 20%,rgba(245,227,161,.55),transparent 65%),#f6f1e4",
                        }}
                    >
                        {mark}
                    </span>
                )}
                {p.badge && (
                    <span
                        className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-black"
                        style={{ backgroundImage: goldFill }}
                    >
                        {p.badge}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                {categoryLabel && <p className="text-xs text-gold-deep">{categoryLabel}</p>}
                <h3 className="mt-1 text-[15px] font-semibold leading-snug text-black sm:text-base">
                    {p.href ? (
                        <a href={p.href} className="focus:outline-none focus-visible:underline">
                            {p.name}
                        </a>
                    ) : (
                        p.name
                    )}
                </h3>
                {p.description && (
                    <p className="mt-1 text-[13px] leading-relaxed text-black/55">{p.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span className="text-base font-semibold text-black">{formatPrice(p.price)}</span>
                    <button
                        type="button"
                        onClick={() => onAddToCart?.(p)}
                        aria-label={`أضف ${p.name} إلى السلة`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-gold-soft transition-colors duration-300 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gold hover:bg-[linear-gradient(135deg,#f5e3a1,#d4af37_55%,#b8891f)]"
                    >
                        <ShoppingBag size={18} strokeWidth={1.8} aria-hidden />
                    </button>
                </div>
            </div>
        </article>
    );
}

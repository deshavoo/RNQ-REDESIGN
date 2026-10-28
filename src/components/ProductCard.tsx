"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { cart } from "./cart/cart-store";
import { productKey, productPath } from "./brands";
import type { BrandId, Product } from "./brands";
import { brandFill } from "./theme";
import Price from "./region/Price";

interface ProductCardProps {
    product: Product;
    brand: BrandId;
    mark: string;
    categoryLabel?: string;
    hardNav?: boolean;
    keepScroll?: boolean;
}

const linkClass =
    "after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand";

export default function ProductCard({ product: p, brand, mark, categoryLabel, hardNav = false, keepScroll = false }: ProductCardProps) {
    const href = productPath(brand, p);
    const [added, setAdded] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const add = () => {
        cart.add(brand, productKey(p));
        setAdded(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 1600);
    };

    return (
        <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-[border-color,box-shadow] duration-300 hover:border-brand/60 hover:shadow-[0_18px_40px_-26px_rgba(0,61,35,0.55)]">
            <div className="relative aspect-square overflow-hidden bg-[#fef8eb]">
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
                        className="absolute inset-0 flex items-center justify-center text-7xl font-semibold text-brand/25"
                        style={{ background: "radial-gradient(ellipse at 70% 20%,rgba(187,207,205,.55),transparent 65%),#fef8eb" }}
                    >
                        {mark}
                    </span>
                )}
                {p.badge && (
                    <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundImage: brandFill }}>
                        {p.badge}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                {categoryLabel && <p className="text-xs text-brand-deep">{categoryLabel}</p>}
                <h3 className="mt-1 text-[15px] font-semibold leading-snug text-black sm:text-base">
                    {hardNav ? (
                        <a href={href} className={linkClass}>{p.name}</a>
                    ) : (
                        <Link href={href} scroll={!keepScroll} className={linkClass}>{p.name}</Link>
                    )}
                </h3>
                {p.description && <p className="mt-1 text-[13px] leading-relaxed text-black/55">{p.description}</p>}

                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span className="text-base font-semibold text-black"><Price product={p} /></span>
                    <button
                        type="button"
                        onClick={add}
                        aria-label={`أضف ${p.name} إلى السلة`}
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${added ? "text-white" : "bg-brand text-brand-soft hover:bg-brand-deep hover:text-white"}`}
                        style={added ? { backgroundImage: brandFill } : undefined}
                    >
                        {added ? <Check size={18} strokeWidth={2.2} aria-hidden /> : <ShoppingBag size={18} strokeWidth={1.8} aria-hidden />}
                    </button>
                    <span role="status" className="sr-only">{added ? `تمت إضافة ${p.name} إلى السلة` : ""}</span>
                </div>
            </div>
        </article>
    );
}

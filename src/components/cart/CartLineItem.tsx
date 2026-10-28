"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { BRANDS, formatPrice, productPath } from "@/components/brands";
import Price from "@/components/region/Price";
import { useRegion } from "@/components/region/region-store";
import { MAX_QTY } from "@/lib/shop";
import { cart } from "./cart-store";
import type { CartLine } from "./cart-store";

const stepBtn =
    "flex h-9 w-9 items-center justify-center text-black transition-colors hover:text-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-35";

export default function CartLineItem({ line }: { line: CartLine }) {
    const { brand, productId, product: p, qty, total } = line;
    const region = useRegion();

    return (
        <li className="flex gap-4 py-5">
            <Link href={productPath(brand, p)} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#fef8eb] ring-1 ring-brand/25 sm:h-28 sm:w-28">
                {p.image && <Image src={p.image} alt={p.name} fill sizes="112px" className="object-cover" />}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-brand-deep">{BRANDS[brand].title}</p>
                        <Link href={productPath(brand, p)} className="mt-0.5 block font-semibold text-black hover:text-brand-deep">
                            {p.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-black/55"><Price product={p} /></p>
                    </div>
                    <button
                        type="button"
                        onClick={() => cart.remove(brand, productId)}
                        aria-label={`حذف ${p.name} من السلة`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                        <Trash2 size={17} aria-hidden />
                    </button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div role="group" aria-label={`كمية ${p.name}`} className="flex items-center rounded-full border border-black/15">
                        <button type="button" onClick={() => cart.setQty(brand, productId, qty + 1)} disabled={qty >= MAX_QTY} aria-label="زيادة الكمية" className={stepBtn}>
                            <Plus size={15} aria-hidden />
                        </button>
                        <output aria-live="polite" className="min-w-8 text-center text-sm font-semibold">{qty}</output>
                        <button type="button" onClick={() => cart.setQty(brand, productId, qty - 1)} disabled={qty <= 1} aria-label="تقليل الكمية" className={stepBtn}>
                            <Minus size={15} aria-hidden />
                        </button>
                    </div>
                    <p className="font-bold text-black">{formatPrice(total, region)}</p>
                </div>
            </div>
        </li>
    );
}

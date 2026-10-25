"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { cart } from "./cart/cart-store";
import { formatPrice, productKey } from "./brands";
import type { BrandId, Product } from "./brands";
import { MAX_QTY } from "@/lib/shop";
import { goldFill } from "./theme";

export function QuickViewModal({ labelledBy, children }: { labelledBy: string; children: ReactNode }) {
    const ref = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    useEffect(() => {
        const d = ref.current;
        if (d && !d.open) d.showModal();
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const close = () => router.back();

    return (
        <dialog
            ref={ref}
            dir="rtl"
            lang="ar"
            aria-labelledby={labelledBy}
            onCancel={(e) => {
                e.preventDefault();
                close();
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
            }}
            className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-0 text-black transition-[opacity,transform] duration-300 backdrop:bg-black/70 starting:open:translate-y-6 starting:open:opacity-0 motion-reduce:transition-none sm:m-auto sm:max-w-5xl sm:rounded-3xl"
        >
            <div className="sticky top-0 z-20 h-0">
                <button
                    type="button"
                    onClick={close}
                    aria-label="إغلاق"
                    className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-[linear-gradient(135deg,#f5e3a1,#d4af37_55%,#b8891f)] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                    <X size={20} aria-hidden />
                </button>
            </div>
            <div className="p-5 pt-16 sm:p-8 sm:pt-14">{children}</div>
        </dialog>
    );
}

export function ProductGallery({
    images,
    name,
    preload = false,
}: {
    images: string[];
    name: string;
    preload?: boolean;
}) {
    const [i, setI] = useState(0);

    return (
        <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f6f1e4] ring-1 ring-gold/30">
                <Image
                    key={images[i]}
                    src={images[i]}
                    alt={`${name} - صورة ${i + 1}`}
                    fill
                    preload={preload && i === 0}
                    sizes="(min-width:1024px) 512px, 100vw"
                    className="object-cover"
                />
            </div>
            <ul className="mt-3 grid grid-cols-5 gap-2">
                {images.map((src, n) => (
                    <li key={src}>
                        <button
                            type="button"
                            onClick={() => setI(n)}
                            aria-label={`عرض الصورة ${n + 1}`}
                            aria-current={n === i}
                            className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-[#f6f1e4] ring-1 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${n === i ? "ring-2 ring-gold" : "ring-black/10 hover:ring-gold/60"
                                }`}
                        >
                            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ProductActions({ brandId, product }: { brandId: BrandId; product: Product }) {
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current);
        },
        []
    );

    const add = () => {
        cart.add(brandId, productKey(product), qty);
        setAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 2200);
    };

    const stepBtn =
        "flex h-12 w-12 items-center justify-center text-black transition-colors hover:text-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-35";

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
                role="group"
                aria-label="الكمية"
                className="flex h-13 w-full items-center justify-between rounded-full border border-black/20 sm:w-auto"
            >
                <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                    disabled={qty >= MAX_QTY}
                    aria-label="زيادة الكمية"
                    className={`${stepBtn} rounded-e-full`}
                >
                    <Plus size={18} aria-hidden />
                </button>
                <output aria-live="polite" className="min-w-10 text-center text-base font-semibold">
                    {qty}
                </output>
                <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="تقليل الكمية"
                    className={`${stepBtn} rounded-s-full`}
                >
                    <Minus size={18} aria-hidden />
                </button>
            </div>

            <button
                type="button"
                onClick={add}
                className="inline-flex min-h-13 flex-1 items-center justify-center gap-3 rounded-full px-8 text-base font-bold text-black transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                style={{ backgroundImage: goldFill }}
            >
                {added ? <Check size={19} aria-hidden /> : <ShoppingBag size={19} aria-hidden />}
                {added ? "تمت الإضافة" : `أضف إلى السلة · ${formatPrice(product.price * qty)}`}
            </button>

            <span role="status" className="sr-only">
                {added ? `تمت إضافة ${qty} من ${product.name} إلى السلة` : ""}
            </span>
        </div>
    );
}

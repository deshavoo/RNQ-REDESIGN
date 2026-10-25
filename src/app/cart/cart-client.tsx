"use client";

import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";
import CartLineItem from "@/components/cart/CartLineItem";
import { CartSkeleton, EmptyCart } from "@/components/cart/CartStates";
import { useCart, useHydrated } from "@/components/cart/cart-store";
import { formatPrice } from "@/components/brands";
import { goldFill } from "@/components/theme";
import { FREE_SHIPPING_FROM } from "@/lib/shop";

export default function CartClient() {
    const hydrated = useHydrated();
    const { lines, count, subtotal } = useCart();
    const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal);
    const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));

    return (
        <main dir="rtl" lang="ar" className="min-h-[60vh] bg-[#faf7ef] px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-3xl font-semibold text-black sm:text-4xl">
                    سلة التسوق
                    {hydrated && count > 0 && <span className="ms-3 align-middle text-base font-normal text-black/50">({count} منتج)</span>}
                </h1>

                {!hydrated ? (
                    <CartSkeleton />
                ) : lines.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="grid animate-fade-up gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
                        <section aria-label="المنتجات" className="rounded-3xl border border-black/10 bg-white px-5 sm:px-6">
                            <ul className="divide-y divide-black/10">
                                {lines.map((l) => (
                                    <CartLineItem key={`${l.brand}/${l.productId}`} line={l} />
                                ))}
                            </ul>
                        </section>

                        <aside aria-label="ملخص الطلب" className="h-fit rounded-3xl border border-gold/30 bg-white p-6 lg:sticky lg:top-32">
                            <div className="rounded-2xl bg-gold/10 p-4 ring-1 ring-gold/25">
                                <p className="flex items-center gap-2 text-sm font-semibold text-black">
                                    <Truck size={17} className="text-gold-deep" aria-hidden />
                                    {remaining > 0 ? `أضف ${formatPrice(remaining)} للحصول على توصيل مجاني` : "طلبك مؤهل للتوصيل المجاني"}
                                </p>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundImage: goldFill }} />
                                </div>
                            </div>

                            <dl className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-black/60">المجموع الفرعي</dt>
                                    <dd className="font-semibold text-black">{formatPrice(subtotal)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-black/60">التوصيل</dt>
                                    <dd className="text-black/60">يُحسب في الخطوة التالية</dd>
                                </div>
                            </dl>

                            <Link
                                href="/checkout"
                                className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-bold text-black transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                style={{ backgroundImage: goldFill }}
                            >
                                إتمام الطلب
                                <ArrowLeft size={18} aria-hidden />
                            </Link>
                            <Link href="/products" className="mt-3 block text-center text-sm font-semibold text-gold-deep underline-offset-4 hover:underline">
                                متابعة التسوق
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}

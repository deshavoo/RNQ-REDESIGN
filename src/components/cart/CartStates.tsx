import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { brandFill } from "@/components/theme";

export function CartSkeleton() {
    return (
        <div aria-hidden className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl bg-black/5" />
                ))}
            </div>
            <div className="h-64 animate-pulse rounded-3xl bg-black/5" />
        </div>
    );
}

export function EmptyCart() {
    return (
        <div className="mx-auto max-w-md animate-fade-up rounded-3xl border border-dashed border-brand/50 bg-white px-6 py-14 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-soft">
                <ShoppingBag size={28} aria-hidden />
            </span>
            <p className="mt-5 text-lg font-semibold text-black">سلتك فارغة</p>
            <p className="mt-2 text-sm text-black/60">تصفّح قهوة بارنيز وحلويات سعد الدين وأضف ما يعجبك.</p>
            <Link
                href="/products"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-8 font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                style={{ backgroundImage: brandFill }}
            >
                تصفح المنتجات
            </Link>
        </div>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { brandFill } from "@/components/theme";

export const metadata: Metadata = {
    title: "الصفحة غير موجودة",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main dir="rtl" lang="ar" className="relative isolate flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-white px-4 py-20 text-center">
            <span aria-hidden className="pointer-events-none absolute -z-10 select-none text-[10rem] font-black leading-none text-brand/10 sm:text-[16rem]">404</span>
            <h1 className="text-3xl font-semibold text-black sm:text-4xl">الصفحة غير موجودة</h1>
            <p className="mt-4 max-w-md leading-loose text-black/60">يبدو أن الرابط غير صحيح أو أن الصفحة نُقلت. تصفّح منتجاتنا أو عُد إلى الصفحة الرئيسية.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="inline-flex min-h-12 items-center justify-center rounded-full px-8 font-bold text-white" style={{ backgroundImage: brandFill }}>
                    تصفح المنتجات
                </Link>
                <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand/60 px-8 font-bold text-black hover:text-brand-deep">
                    الصفحة الرئيسية
                </Link>
            </div>
        </main>
    );
}

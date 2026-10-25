"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS, SAMPLE_PRODUCTS, productPath } from "./brands";
import type { BrandId, Product } from "./brands";
import ProductCard from "./ProductCard";
import { goldFill } from "./theme";

export interface SideImageData {
    src: string;
    alt: string;
    href: string;
    caption: string;
}

/** الصور الافتراضية هي نفس صور الهيرو. غيّرها بصورتين مخصوصين للسكشن (يفضل طوليتين 4:5) */
const DEFAULT_RIGHT: SideImageData = {
    src: "/images/best-barns.jpg",
    alt: "قهوة بارنيز المختصة",
    href: "/products/barns",
    caption: BRANDS.barns.title,
};
const DEFAULT_LEFT: SideImageData = {
    src: "/images/best-saadeddin.jpg",
    alt: "حلويات وتمور سعد الدين",
    href: "/products/saadeddin",
    caption: BRANDS.saadeddin.title,
};

const BRAND_ORDER: BrandId[] = ["barns", "saadeddin"];

function SideImage({ img, className = "" }: { img: SideImageData; className?: string }) {
    return (
        <Link
            href={img.href}
            className={`group relative block overflow-hidden rounded-3xl bg-[#f6f1e4] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${className}`}
        >
            <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width:1024px) 26vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
            />
            <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-white sm:p-5">
                <span className="text-base font-semibold sm:text-lg">{img.caption}</span>

            </span>
        </Link>
    );
}

interface BestSellersProps {
    /** المنتجات الأكثر طلباً لكل براند. الافتراضي أول 6 من البيانات التجريبية */
    products?: Partial<Record<BrandId, Product[]>>;
    rightImage?: SideImageData;
    leftImage?: SideImageData;
    onAddToCart?: (product: Product) => void;
    id?: string;
    className?: string;
}

export default function BestSellers({
    products,
    rightImage = DEFAULT_RIGHT,
    leftImage = DEFAULT_LEFT,
    onAddToCart,
    id = "best-sellers",
    className = "",
}: BestSellersProps) {
    const [brandId, setBrandId] = useState<BrandId>("barns");
    const brand = BRANDS[brandId];
    const items = (products?.[brandId] ?? SAMPLE_PRODUCTS[brandId]).slice(0, 6);
    const categoryLabel = (catId: string) => brand.categories.find((c) => c.id === catId)?.label;

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`scroll-mt-28 bg-white py-14 sm:py-20 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* mobile: the two images sit side by side above the content */}
                <div className="mb-8 grid grid-cols-2 gap-3 lg:hidden">
                    <SideImage img={rightImage} className="aspect-4/5" />
                    <SideImage img={leftImage} className="aspect-4/5" />
                </div>

                {/* RTL: first column = RIGHT image, last column = LEFT image */}
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10">
                    {/* sticky right image */}
                    <div className="hidden lg:block">
                        <div className="sticky top-28 h-[calc(100svh-8rem)] max-h-176 min-h-96">
                            <SideImage img={rightImage} className="h-full w-full" />
                        </div>
                    </div>

                    {/* content */}
                    <div>
                        <header className="mb-6 text-center sm:mb-8">
                            <h2 id={`${id}-title`} className="text-3xl font-semibold text-black sm:text-4xl">
                                الأكثر طلباً
                            </h2>
                            <p className="mx-auto mt-3 max-w-md text-base leading-loose text-black/60">
                                اختيارات عملائنا من القهوة والحلويات، يعودون إليها مرة بعد مرة.
                            </p>

                            <div
                                role="group"
                                aria-label="اختر البراند"
                                className="mt-6 inline-flex rounded-full border border-gold/30 bg-black/3 p-0.5"
                            >
                                {BRAND_ORDER.map((b) => {
                                    const active = brandId === b;
                                    return (
                                        <button
                                            key={b}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => setBrandId(b)}
                                            className={`min-h-10 rounded-full px-5 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${active ? "text-black" : "text-black/60 hover:text-black"
                                                }`}
                                            style={active ? { backgroundImage: goldFill } : undefined}
                                        >
                                            {BRANDS[b].title}
                                        </button>
                                    );
                                })}
                            </div>
                        </header>

                        <ul key={brandId} className="grid grid-cols-2 gap-3 sm:gap-5">
                            {items.map((p) => (
                                <li key={p.id} className="flex">
                                    <ProductCard
                                        product={p}
                                        href={productPath(brandId, p)}
                                        keepScroll
                                        mark={brand.mark}
                                        categoryLabel={categoryLabel(p.category)}
                                        onAddToCart={onAddToCart}
                                    />
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 text-center sm:mt-10">
                            <Link
                                href={`/products/${brandId}`}
                                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-gold/60 px-7 text-sm font-bold text-black transition-colors duration-300 hover:border-transparent hover:bg-[linear-gradient(135deg,#f5e3a1,#d4af37_55%,#b8891f)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-base"
                            >
                                عرض كل منتجات {brand.title}
                            </Link>
                        </div>
                    </div>

                    {/* sticky left image */}
                    <div className="hidden lg:block">
                        <div className="sticky top-28 h-[calc(100svh-8rem)] max-h-176 min-h-96">
                            <SideImage img={leftImage} className="h-full w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

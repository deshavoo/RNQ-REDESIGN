import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BRANDS, SAMPLE_PRODUCTS } from "./brands";
import type { BrandId } from "./brands";
import ProductCard from "./ProductCard";
import { brandLine } from "./theme";

const DEFAULT_PICKS: { brand: BrandId; slug: string }[] = [
    { brand: "saadeddin", slug: "golden-gift-box" },
    { brand: "barns", slug: "barns-signature-blend" },
    { brand: "saadeddin", slug: "lotus-cheesecake" },
    { brand: "saadeddin", slug: "medjool-dates" },
];

interface FeaturedCollectionsProps {
    picks?: { brand: BrandId; slug: string }[];
    id?: string;
    className?: string;
}

export default function FeaturedCollections({ picks = DEFAULT_PICKS, id = "featured", className = "" }: FeaturedCollectionsProps) {
    const items = picks.flatMap(({ brand, slug }) => {
        const product = SAMPLE_PRODUCTS[brand].find((p) => p.slug === slug);
        return product ? [{ brand, product }] : [];
    });

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`scroll-mt-28 bg-cream py-14 sm:py-20 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col items-center gap-4 text-center sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:text-start">
                    <div>
                        <h2 id={`${id}-title`} className="text-3xl font-semibold text-black sm:text-4xl">
                            مختارات مميزة
                        </h2>
                        <p className="mt-3 max-w-md text-base leading-loose text-black/60">تشكيلة اخترناها لك من أجود منتجاتنا.</p>
                        <span aria-hidden className="mx-auto mt-5 block h-px w-24 sm:mx-0" style={{ backgroundImage: brandLine }} />
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full text-sm font-bold text-brand-deep transition-colors duration-300 hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:text-base"
                    >
                        عرض الكل
                        <ArrowLeft size={16} aria-hidden />
                    </Link>
                </header>

                <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                    {items.map(({ brand, product }) => (
                        <li key={`${brand}-${product.id}`} className="flex">
                            <ProductCard
                                product={product}
                                brand={brand}
                                keepScroll
                                mark={BRANDS[brand].mark}
                                categoryLabel={BRANDS[brand].categories.find((c) => c.id === product.category)?.label}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

"use client";

import { useId, useMemo, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";
import { BRANDS, SAMPLE_PRODUCTS, formatPrice } from "./brands";
import type { BrandCategory, BrandId, Product } from "./brands";
import { goldFill } from "./theme";

export type { BrandCategory, BrandConfig, BrandId, Product } from "./brands";

const goldLine = "linear-gradient(90deg,#d4af37aa,transparent)";

type Sort = "default" | "asc" | "desc";

interface BrandProductsProps {
    brand: BrandId;
    products?: Product[];
    id?: string;
    initialCategory?: string;
    headingAs?: "h1" | "h2";
    className?: string;
}

export default function BrandProducts({
    brand: brandId,
    products,
    id,
    initialCategory,
    headingAs: Heading = "h2",
    className = "",
}: BrandProductsProps) {
    const brand = BRANDS[brandId];
    const items = products ?? SAMPLE_PRODUCTS[brandId];
    const uid = useId();

    const bounds = useMemo(() => {
        const prices = items.map((p) => p.price);
        const min = prices.length ? Math.floor(Math.min(...prices)) : 0;
        const max = prices.length ? Math.ceil(Math.max(...prices)) : 0;
        return { min, max };
    }, [items]);

    const [category, setCategory] = useState<string>(initialCategory ?? "all");
    const [priceCap, setPriceCap] = useState<number | null>(null);
    const [sort, setSort] = useState<Sort>("default");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const cap = priceCap ?? bounds.max;
    const isFiltered = category !== "all" || priceCap !== null || sort !== "default";

    const visible = useMemo(() => {
        const list = items.filter(
            (p) => (category === "all" || p.category === category) && p.price <= cap
        );
        if (sort === "asc") return [...list].sort((a, b) => a.price - b.price);
        if (sort === "desc") return [...list].sort((a, b) => b.price - a.price);
        return list;
    }, [items, category, cap, sort]);

    const countFor = (catId: string) =>
        catId === "all" ? items.length : items.filter((p) => p.category === catId).length;

    const categoryLabel = (catId: string) =>
        brand.categories.find((c) => c.id === catId)?.label ?? "";

    const reset = () => {
        setCategory("all");
        setPriceCap(null);
        setSort("default");
    };

    const sectionId = id ?? brand.id;
    const panelId = `${uid}-filters`;
    const headingId = `${uid}-title`;

    const categoryOptions: BrandCategory[] = [{ id: "all", label: "الكل" }, ...brand.categories];

    return (
        <section
            id={sectionId}
            dir="rtl"
            lang="ar"
            aria-labelledby={headingId}
            className={`relative scroll-mt-28 py-14 sm:py-20 ${brand.tinted ? "bg-[#fbf8ef]" : "bg-white"} ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-8 sm:mb-10">
                    <Heading id={headingId} className="text-3xl font-semibold text-black sm:text-4xl">
                        {brand.title}
                    </Heading>
                    <p className="mt-3 max-w-xl text-base leading-loose text-black/65">{brand.blurb}</p>
                    <span
                        aria-hidden
                        className="mt-5 block h-px w-40"
                        style={{ backgroundImage: goldLine }}
                    />
                </header>

                <button
                    type="button"
                    onClick={() => setFiltersOpen((o) => !o)}
                    aria-expanded={filtersOpen}
                    aria-controls={panelId}
                    className="mb-4 flex min-h-11 items-center gap-2 rounded-full border border-gold/50 bg-white px-5 text-sm font-semibold text-black transition-colors hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
                >
                    <SlidersHorizontal size={17} className="text-gold-deep" aria-hidden />
                    الفلاتر
                    {isFiltered && (
                        <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
                    )}
                </button>

                <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
                    <aside
                        id={panelId}
                        aria-label={`فلاتر ${brand.title}`}
                        className={`${filtersOpen ? "block" : "hidden"} lg:sticky lg:top-32 lg:block lg:self-start`}
                    >
                        <div className="rounded-2xl border border-gold/30 bg-white p-5">
                            <fieldset>
                                <legend className="mb-3 text-sm font-semibold text-gold-deep">القسم</legend>
                                <ul className="flex flex-col gap-1">
                                    {categoryOptions.map((c) => {
                                        const active = category === c.id;
                                        return (
                                            <li key={c.id}>
                                                <label
                                                    className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 text-[15px] transition-colors focus-within:ring-2 focus-within:ring-gold ${active
                                                        ? "bg-black font-semibold text-white"
                                                        : "text-black/75 hover:bg-black/4"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            name={`${uid}-category`}
                                                            value={c.id}
                                                            checked={active}
                                                            onChange={() => setCategory(c.id)}
                                                            className="sr-only"
                                                        />
                                                        {c.label}
                                                    </span>
                                                    <span
                                                        className={`text-xs ${active ? "text-gold-soft" : "text-black/45"}`}
                                                    >
                                                        {countFor(c.id)}
                                                    </span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </fieldset>

                            {bounds.max > bounds.min && (
                                <div className="mt-6 border-t border-black/10 pt-5">
                                    <label
                                        htmlFor={`${uid}-price`}
                                        className="mb-3 flex items-center justify-between text-sm font-semibold text-gold-deep"
                                    >
                                        السعر
                                        <span className="font-normal text-black/65">
                                            حتى {formatPrice(cap)}
                                        </span>
                                    </label>
                                    <input
                                        id={`${uid}-price`}
                                        type="range"
                                        min={bounds.min}
                                        max={bounds.max}
                                        step={5}
                                        value={cap}
                                        onChange={(e) => {
                                            const v = Number(e.target.value);
                                            setPriceCap(v >= bounds.max ? null : v);
                                        }}
                                        className="h-6 w-full cursor-pointer accent-gold"
                                    />
                                    <div className="mt-1 flex justify-between text-xs text-black/45">
                                        <span>{formatPrice(bounds.min)}</span>
                                        <span>{formatPrice(bounds.max)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 border-t border-black/10 pt-5">
                                <label htmlFor={`${uid}-sort`} className="mb-2 block text-sm font-semibold text-gold-deep">
                                    الترتيب
                                </label>
                                <select
                                    id={`${uid}-sort`}
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value as Sort)}
                                    className="min-h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm text-black focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                >
                                    <option value="default">الافتراضي</option>
                                    <option value="asc">السعر: من الأقل للأعلى</option>
                                    <option value="desc">السعر: من الأعلى للأقل</option>
                                </select>
                            </div>

                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-black/20 text-sm font-semibold text-black/75 transition-colors hover:border-gold hover:text-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                >
                                    <RotateCcw size={15} aria-hidden />
                                    مسح الفلاتر
                                </button>
                            )}
                        </div>
                    </aside>

                    <div>
                        <p aria-live="polite" className="mb-4 text-sm text-black/55">
                            {visible.length} منتج
                        </p>

                        {visible.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gold/50 px-6 py-16 text-center">
                                <p className="text-base font-semibold text-black">لا توجد منتجات بهذه الفلاتر</p>
                                <p className="mt-2 text-sm text-black/60">جرّب قسماً آخر أو ارفع حد السعر.</p>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-bold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                                    style={{ backgroundImage: goldFill }}
                                >
                                    مسح الفلاتر
                                </button>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                                {visible.map((p) => (
                                    <li key={p.id} className="flex">
                                        <ProductCard
                                            product={p}
                                            brand={brandId}
                                            keepScroll
                                            mark={brand.mark}
                                            categoryLabel={categoryLabel(p.category)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

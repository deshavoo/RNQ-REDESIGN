import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductDetails from "@/components/ProductDetails";
import { BRANDS, SAMPLE_PRODUCTS, findProduct, isBrandId, productPath, productStaticParams } from "@/components/brands";
import { HAS_SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
    return productStaticParams();
}

type Params = Promise<{ brand: string; productId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { brand, productId } = await params;
    if (!isBrandId(brand)) return {};
    const product = findProduct(brand, productId);
    if (!product) return {};

    const b = BRANDS[brand];
    const path = productPath(brand, product);
    const description = product.description ?? product.details ?? b.blurb;

    return {
        title: `${product.name} | ${b.title}`,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            title: `${product.name} | ${b.title}`,
            description,
            url: path,
            images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
        },
    };
}

export default async function ProductPage({ params }: { params: Params }) {
    const { brand: brandId, productId } = await params;
    if (!isBrandId(brandId)) notFound();
    const product = findProduct(brandId, productId);
    if (!product) notFound();

    const brand = BRANDS[brandId];
    const category = brand.categories.find((c) => c.id === product.category);
    const categoryLabel = (id: string) => brand.categories.find((c) => c.id === id)?.label;

    const all = SAMPLE_PRODUCTS[brandId].filter((p) => p.id !== product.id);
    const related = [
        ...all.filter((p) => p.category === product.category),
        ...all.filter((p) => p.category !== product.category),
    ].slice(0, 4);

    const crumbs = [
        { name: "الرئيسية", href: "/" },
        { name: brand.title, href: `/products/${brandId}` },
        ...(category ? [{ name: category.label, href: `/products/${brandId}?type=${category.id}` }] : []),
        { name: product.name, href: productPath(brandId, product) },
    ];

    const jsonLd = HAS_SITE_URL
        ? [
            {
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description ?? product.details,
                image: product.images?.length
                    ? product.images.map((i) => absoluteUrl(i))
                    : product.image
                        ? [absoluteUrl(product.image)]
                        : undefined,
                sku: product.id,
                brand: { "@type": "Brand", name: brand.title },
                offers: [
                    { price: product.price, priceCurrency: "SAR", eligibleRegion: "SA" },
                    { price: product.priceEg, priceCurrency: "EGP", eligibleRegion: "EG" },
                ].map((o) => ({
                    "@type": "Offer",
                    url: absoluteUrl(productPath(brandId, product)),
                    ...o,
                    availability: "https://schema.org/InStock",
                })),
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: crumbs.map((c, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: c.name,
                    item: absoluteUrl(c.href),
                })),
            },
        ]
        : null;

    return (
        <main dir="rtl" lang="ar" className="bg-white py-8 text-black sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav aria-label="مسار التنقل" className="mb-6 sm:mb-8">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-black/55">
                        {crumbs.map((c, i) => {
                            const last = i === crumbs.length - 1;
                            return (
                                <li key={c.href} className="flex items-center gap-2">
                                    {last ? (
                                        <span aria-current="page" className="font-semibold text-black">
                                            {c.name}
                                        </span>
                                    ) : (
                                        <>
                                            <Link href={c.href} className="hover:text-brand-deep focus:outline-none focus-visible:underline">
                                                {c.name}
                                            </Link>
                                            <ChevronLeft size={14} aria-hidden className="text-black/30" />
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <ProductDetails brandId={brandId} product={product} variant="page" />

                {related.length > 0 && (
                    <section aria-labelledby="related-title" className="mt-16 border-t border-brand/25 pt-12 sm:mt-24 sm:pt-16">
                        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                            <h2 id="related-title" className="text-2xl font-semibold sm:text-3xl">
                                منتجات قد تعجبك
                            </h2>
                            <Link
                                href={`/products/${brandId}`}
                                className="text-sm font-bold text-brand-deep underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                            >
                                عرض كل منتجات {brand.title}
                            </Link>
                        </div>
                        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                            {related.map((r) => (
                                <li key={r.id} className="flex">
                                    <ProductCard
                                        product={r}
                                        brand={brandId}
                                        hardNav
                                        mark={brand.mark}
                                        categoryLabel={categoryLabel(r.category)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
            )}
        </main>
    );
}

import Image from "next/image";
import { BRANDS, productPath } from "./brands";
import Price from "./region/Price";
import type { BrandId, Product } from "./brands";
import { ProductActions, ProductGallery } from "./ProductClient";
import { brandFill } from "./theme";

interface ProductDetailsProps {
    brandId: BrandId;
    product: Product;
    variant: "page" | "modal";
}

export default function ProductDetails({ brandId, product: p, variant }: ProductDetailsProps) {
    const brand = BRANDS[brandId];
    const Heading = variant === "page" ? "h1" : "h2";
    const categoryLabel = brand.categories.find((c) => c.id === p.category)?.label;
    const images = p.images?.length ? p.images : p.image ? [p.image] : [];

    return (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
                {images.length > 1 ? (
                    <ProductGallery images={images} name={p.name} preload />
                ) : (
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#fef8eb] ring-1 ring-brand/30">
                        {images[0] ? (
                            <Image
                                src={images[0]}
                                alt={p.name}
                                fill
                                preload
                                sizes="(min-width:1024px) 512px, 100vw"
                                className="object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden
                                className="absolute inset-0 flex items-center justify-center text-9xl font-semibold text-brand/25"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at 70% 20%,rgba(187,207,205,.55),transparent 65%),#fef8eb",
                                }}
                            >
                                {brand.mark}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-brand-deep">{brand.title}</p>
                    {categoryLabel && (
                        <>
                            <span aria-hidden className="h-1 w-1 rounded-full bg-black/25" />
                            <p className="text-sm text-black/60">{categoryLabel}</p>
                        </>
                    )}
                    {p.badge && (
                        <span
                            className="rounded-full px-3 py-1 text-xs font-bold text-white"
                            style={{ backgroundImage: brandFill }}
                        >
                            {p.badge}
                        </span>
                    )}
                </div>

                <Heading id="product-title" className="mt-3 text-3xl font-semibold leading-tight text-black sm:text-4xl">
                    {p.name}
                </Heading>

                <p className="mt-4 text-3xl font-semibold text-black"><Price product={p} /></p>
                <span
                    aria-hidden
                    className="mt-5 block h-px w-32"
                    style={{ backgroundImage: "linear-gradient(90deg,#005430,transparent)" }}
                />

                {p.description && <p className="mt-6 text-lg leading-loose text-black/75">{p.description}</p>}
                {p.details && <p className="mt-3 text-base leading-loose text-black/60">{p.details}</p>}

                {p.specs && p.specs.length > 0 && (
                    <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
                        {p.specs.map((s) => (
                            <div key={s.label} className="flex items-center justify-between gap-6 py-3 text-sm">
                                <dt className="text-black/55">{s.label}</dt>
                                <dd className="font-semibold text-black">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <div className="mt-8">
                    <ProductActions brandId={brandId} product={p} />
                </div>

                {variant === "modal" && (
                    <a
                        href={productPath(brandId, p)}
                        className="mt-6 inline-flex min-h-11 items-center self-start text-sm font-bold text-brand-deep underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                        عرض صفحة المنتج كاملة
                    </a>
                )}
            </div>
        </div>
    );
}

import Image from "next/image";
import { BRANDS, formatPrice, productPath } from "./brands";
import type { BrandId, Product } from "./brands";
import { ProductActions, ProductGallery } from "./ProductClient";
import { goldFill } from "./theme";


interface ProductDetailsProps {
    brandId: BrandId;
    product: Product;
    /** page: صفحة كاملة (h1) | modal: داخل النافذة السريعة (h2 + رابط للصفحة الكاملة) */
    variant: "page" | "modal";
}

/** Server Component: المحتوى واحد في الصفحة والنافذة، والتفاعل بس في ProductActions و ProductGallery */
export default function ProductDetails({ brandId, product: p, variant }: ProductDetailsProps) {
    const brand = BRANDS[brandId];
    const Heading = variant === "page" ? "h1" : "h2";
    const categoryLabel = brand.categories.find((c) => c.id === p.category)?.label;
    const images = p.images?.length ? p.images : p.image ? [p.image] : [];
    const priority = true; // أول شيء ظاهر في الصفحة والنافذة

    return (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* ---------- image (right in RTL) ---------- */}
            <div>
                {images.length > 1 ? (
                    <ProductGallery images={images} name={p.name} priority={priority} />
                ) : (
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f6f1e4] ring-1 ring-gold/30">
                        {images[0] ? (
                            <Image
                                src={images[0]}
                                alt={p.name}
                                fill
                                priority={priority}
                                sizes="(min-width:1024px) 512px, 100vw"
                                className="object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden
                                className="absolute inset-0 flex items-center justify-center text-9xl font-semibold text-gold/45"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at 70% 20%,rgba(245,227,161,.55),transparent 65%),#f6f1e4",
                                }}
                            >
                                {brand.mark}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ---------- info (left in RTL) ---------- */}
            <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-gold-deep">{brand.title}</p>
                    {categoryLabel && (
                        <>
                            <span aria-hidden className="h-1 w-1 rounded-full bg-black/25" />
                            <p className="text-sm text-black/60">{categoryLabel}</p>
                        </>
                    )}
                    {p.badge && (
                        <span
                            className="rounded-full px-3 py-1 text-xs font-bold text-black"
                            style={{ backgroundImage: goldFill }}
                        >
                            {p.badge}
                        </span>
                    )}
                </div>

                <Heading id="product-title" className="mt-3 text-3xl font-semibold leading-tight text-black sm:text-4xl">
                    {p.name}
                </Heading>

                <p className="mt-4 text-3xl font-semibold text-black">{formatPrice(p.price)}</p>
                <span
                    aria-hidden
                    className="mt-5 block h-px w-32"
                    style={{ backgroundImage: "linear-gradient(90deg,#d4af37,transparent)" }}
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
                    <ProductActions product={p} />
                </div>

                {variant === "modal" && (
                    /* <a> عادي (مش Link) عشان يفتح الصفحة الكاملة بدل ما النافذة تتفتح تاني */
                    <a
                        href={productPath(brandId, p)}
                        className="mt-6 inline-flex min-h-11 items-center self-start text-sm font-bold text-gold-deep underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                        عرض صفحة المنتج كاملة
                    </a>
                )}
            </div>
        </div>
    );
}

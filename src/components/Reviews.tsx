import Link from "next/link";
import { Quote, Star } from "lucide-react";
import { brandLine } from "./theme";

export interface Review {
    id: string;
    name: string;
    city: string;
    rating: number;
    text: string;
    product?: string;
}

const DEFAULT_REVIEWS: Review[] = [
    {
        id: "r1",
        name: "نورة",
        city: "الرياض",
        rating: 5,
        text: "علبة التمور وصلت بتغليف أنيق جداً وكانت هدية مثالية لوالدتي. الطعم طازج والجودة ممتازة.",
        product: "علبة هدايا ذهبية",
    },
    {
        id: "r2",
        name: "عبدالله",
        city: "جدة",
        rating: 5,
        text: "مزيج بارنيز الخاص صار قهوتي اليومية، التحميص طازج والتوصيل كان أسرع مما توقعت.",
        product: "مزيج بارنيز الخاص",
    },
    {
        id: "r3",
        name: "سارة",
        city: "الدمام",
        rating: 4,
        text: "طلبنا ضيافة لاجتماع الشركة والفريق كان متعاوناً جداً في اختيار الكميات والتغليف.",
        product: "ضيافة الشركات",
    },
];

function Stars({ rating }: { rating: number }) {
    return (
        <span className="flex gap-0.5" role="img" aria-label={`التقييم ${rating} من 5`}>
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    size={16}
                    aria-hidden
                    className={i < rating ? "fill-brand text-brand" : "fill-black/10 text-black/10"}
                />
            ))}
        </span>
    );
}

interface ReviewsProps {
    reviews?: Review[];
    reviewHref?: string;
    id?: string;
    className?: string;
}

export default function Reviews({
    reviews = DEFAULT_REVIEWS,
    reviewHref = "/profile?tab=orders",
    id = "reviews",
    className = "",
}: ReviewsProps) {
    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`scroll-mt-28 bg-cream py-16 sm:py-24 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 text-center sm:mb-14">
                    <h2 id={`${id}-title`} className="text-3xl font-semibold text-black sm:text-4xl">
                        آراء عملائنا
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-base leading-loose text-black/60">
                        رضاكم هو ما يجعلنا نهتم بكل تفصيلة.
                    </p>
                    <span aria-hidden className="mx-auto mt-6 block h-px w-24" style={{ backgroundImage: brandLine }} />
                </header>

                <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
                    {reviews.map((r) => (
                        <li key={r.id}>
                            <figure className="relative flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-brand/10">
                                <Quote size={36} aria-hidden className="absolute end-6 top-6 text-brand/15" />
                                <Stars rating={r.rating} />
                                <blockquote className="mt-4 flex-1 text-base leading-loose text-black/75">{r.text}</blockquote>
                                <figcaption className="mt-6 flex items-center gap-3 border-t border-brand/10 pt-5">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-white">
                                        {r.name[0]}
                                    </span>
                                    <span>
                                        <span className="block text-sm font-bold text-black">{r.name}</span>
                                        <span className="block text-xs text-black/55">
                                            {r.city}
                                            {r.product && ` · ${r.product}`}
                                        </span>
                                    </span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 text-center sm:mt-12">
                    <p className="text-base text-black/65">جرّبت منتجاتنا؟ يسعدنا سماع رأيك.</p>
                    <Link
                        href={reviewHref}
                        className="mt-4 inline-flex min-h-12 items-center rounded-full bg-brand px-7 text-sm font-bold text-white transition-colors duration-300 hover:bg-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:text-base"
                    >
                        شاركنا رأيك
                    </Link>
                </div>
            </div>
        </section>
    );
}

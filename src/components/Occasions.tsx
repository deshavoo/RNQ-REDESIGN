import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface Occasion {
    id: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
    alt: string;
    featured?: boolean;
}

const DEFAULT_OCCASIONS: Occasion[] = [
    {
        id: "ramadan",
        title: "ضيافة رمضان",
        description: "تمور فاخرة وقهوة مختصة لسفرتك وزوّارك طوال الشهر الكريم.",
        cta: "تسوّق رمضان",
        href: "/occasions/ramadan",
        image: "/images/occasion-ramadan.jpg",
        alt: "تمور فاخرة وفناجين قهوة عربية على سفرة رمضانية",
        featured: true,
    },
    {
        id: "eid",
        title: "هدايا الأعياد",
        description: "علب حلويات وتمور مغلّفة بأناقة، لتهنئة من تحب بما يليق به.",
        cta: "تسوّق الأعياد",
        href: "/occasions/eid",
        image: "/images/occasion-eid.jpg",
        alt: "علب هدايا عيد من الحلويات والتمور الفاخرة",
    },
    {
        id: "weddings",
        title: "الأفراح والحفلات",
        description: "ضيافة وتوزيعات تليق بليلة العمر، بالكمية والتغليف الذي تختاره.",
        cta: "خطّط لمناسبتك",
        href: "/occasions/weddings",
        image: "/images/occasion-weddings.jpg",
        alt: "توزيعات حلويات وقهوة لحفل زفاف",
    },
    {
        id: "corporate-gifts",
        title: "هدايا الشركات",
        description: "هدايا بشعار شركتك لعملائك وفريقك، مع عرض سعر مفصّل.",
        cta: "اطلب عرض سعر",
        href: "/business/corporate-gifts",
        image: "/images/occasion-corporate.jpg",
        alt: "علب هدايا فاخرة بشعار الشركة",
    },
];

const SIZES_LARGE =
    "(min-width:1280px) 624px, (min-width:1024px) 48vw, 100vw";

const SIZES_SMALL =
    "(min-width:1280px) 304px, (min-width:1024px) 24vw, 50vw";

const CELL: Record<number, string> = {
    0: "aspect-4/5 sm:col-span-2 sm:aspect-16/9 lg:col-span-6 lg:row-span-2 lg:aspect-auto",
    1: "aspect-4/5 sm:col-span-2 sm:aspect-16/9 lg:col-span-6 lg:aspect-auto",
    2: "aspect-4/5 lg:col-span-3 lg:aspect-auto",
    3: "aspect-4/5 lg:col-span-3 lg:aspect-auto",
};

function OccasionCard({
    occasion,
    large,
}: {
    occasion: Occasion;
    large: boolean;
}) {
    return (
        <Link
            href={occasion.href}
            className="group relative block h-full w-full overflow-hidden rounded-3xl bg-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
        >
            <Image
                src={occasion.image}
                alt={occasion.alt}
                fill
                sizes={large ? SIZES_LARGE : SIZES_SMALL}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            />

            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent"
            />

            <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-5 text-white sm:p-7">
                <span className="flex flex-col gap-2">
                    <h3
                        className={`font-semibold leading-tight ${large
                            ? "text-3xl sm:text-4xl"
                            : "text-xl sm:text-2xl"
                            }`}
                    >
                        {occasion.title}
                    </h3>

                    <p
                        className={`max-w-sm leading-loose text-white/85 ${large ? "text-base" : "text-sm"
                            }`}
                    >
                        {occasion.description}
                    </p>
                </span>

                <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-soft/60 bg-black/40 px-5 text-sm font-bold text-white transition-[background-color,color,border-color] duration-300 ease-out group-hover:border-transparent group-hover:bg-white group-hover:text-brand motion-reduce:transition-none">
                    {occasion.cta}

                    <ArrowLeft
                        size={16}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
                    />
                </span>
            </span>
        </Link>
    );
}

interface OccasionsProps {
    occasions?: Occasion[];
    siteUrl?: string;
    id?: string;
    className?: string;
}

export default function Occasions({
    occasions = DEFAULT_OCCASIONS,
    siteUrl,
    id = "occasions",
    className = "",
}: OccasionsProps) {
    const items = occasions.slice(0, 4);

    const jsonLd = siteUrl
        ? {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "المناسبات",
            itemListElement: items.map((occasion, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: occasion.title,
                url: new URL(occasion.href, siteUrl).toString(),
            })),
        }
        : null;

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`relative scroll-mt-28 bg-brand py-16 text-white [contain-intrinsic-size:auto_1100px] [content-visibility:auto] sm:py-24 ${className}`}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,transparent,#c9ddd0,transparent)",
                }}
            />

            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,transparent,#c9ddd0,transparent)",
                }}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 text-center sm:mb-14">
                    <h2
                        id={`${id}-title`}
                        className="text-3xl font-semibold sm:text-4xl"
                    >
                        المناسبات
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-base leading-loose text-white/70">
                        لكل مناسبة ضيافتها: قهوة وحلويات وتمور تُجهَّز وتُغلَّف
                        لتناسب لحظتك.
                    </p>

                    <span
                        aria-hidden="true"
                        className="mx-auto mt-6 block h-px w-24"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg,transparent,#c9ddd0,transparent)",
                        }}
                    />
                </header>

                <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12 lg:grid-rows-[repeat(2,minmax(0,21rem))] lg:gap-6">
                    {items.map((occasion, index) => (
                        <li
                            key={occasion.id}
                            className={`relative ${CELL[index] ?? CELL[2]}`}
                        >
                            <OccasionCard
                                occasion={occasion}
                                large={index < 2}
                            />
                        </li>
                    ))}
                </ul>

                <div className="mt-10 text-center sm:mt-12">
                    <p className="text-base text-white/70">
                        مناسبتك لها طابع خاص؟
                    </p>

                    <Link
                        href="/custom-orders"
                        className="mt-4 inline-flex min-h-12 items-center gap-3 rounded-full border border-brand-soft/60 px-7 text-sm font-bold text-white transition-[background-color,color,border-color] duration-300 ease-out hover:border-transparent hover:bg-white hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand motion-reduce:transition-none sm:text-base"
                    >
                        صمّم طلبك الخاص
                    </Link>
                </div>
            </div>

            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd).replace(
                            /</g,
                            "\\u003c"
                        ),
                    }}
                />
            )}
        </section>
    );
}

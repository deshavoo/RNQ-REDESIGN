import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brandLine } from "./theme";

export interface Collection {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
    alt: string;
}

const DEFAULT_COLLECTIONS: Collection[] = [
    {
        id: "coffee",
        eyebrow: "قهوة بارنيز",
        title: "قهوة مختصة تُحمّص طازجة",
        description: "حبوب مختارة من أفضل المزارع، ومزيج بارنيز الخاص لصباح يليق بك.",
        cta: "تسوّق القهوة",
        href: "/products/barns",
        image: "/images/best-barns.jpg",
        alt: "أكياس وأكواب قهوة بارنيز المختصة",
    },
    {
        id: "dates",
        eyebrow: "حلويات سعد الدين",
        title: "تمور فاخرة",
        description: "سكري وعجوة ومجدول، منتقاة حبة حبة.",
        cta: "تسوّق التمور",
        href: "/products/saadeddin?type=dates",
        image: "/images/products/tamrbox.webp",
        alt: "علبة تمور فاخرة",
    },
    {
        id: "cakes",
        eyebrow: "حلويات سعد الدين",
        title: "الكيكات والتشيز كيك",
        description: "لوتس وتوت وروشيه، طازجة كل يوم.",
        cta: "تسوّق الكيكات",
        href: "/products/saadeddin?type=cakes",
        image: "/images/products/lotuscake.jpeg",
        alt: "تشيز كيك اللوتس",
    },
    {
        id: "sweets",
        eyebrow: "حلويات سعد الدين",
        title: "حلويات شرقية",
        description: "معمول وحلاوة بوصفات أصيلة منذ 1919.",
        cta: "تسوّق الحلويات",
        href: "/products/saadeddin?type=sweets",
        image: "/images/products/mamoul.webp",
        alt: "معمول بالتمر",
    },
];

function CtaLabel({ children }: { children: string }) {
    return (
        <span className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white transition-colors duration-300 group-hover:bg-brand-deep">
            {children}
            <ArrowLeft size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none" />
        </span>
    );
}

function FeatureBanner({ c }: { c: Collection }) {
    return (
        <Link
            href={c.href}
            className="group grid overflow-hidden rounded-3xl bg-cream ring-1 ring-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand md:grid-cols-2"
        >
            <span className="relative block aspect-16/10 overflow-hidden md:order-2 md:aspect-auto md:min-h-96">
                <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width:1280px) 624px, (min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
                />
            </span>
            <span className="flex flex-col justify-center gap-4 p-7 sm:p-10 lg:p-14">
                <span className="text-sm font-semibold text-brand">{c.eyebrow}</span>
                <h3 className="text-3xl font-semibold leading-tight text-black sm:text-4xl">{c.title}</h3>
                <p className="max-w-md text-base leading-loose text-black/65">{c.description}</p>
                <span className="mt-2">
                    <CtaLabel>{c.cta}</CtaLabel>
                </span>
            </span>
        </Link>
    );
}

function CollectionCard({ c }: { c: Collection }) {
    return (
        <Link
            href={c.href}
            className="group flex h-full flex-col overflow-hidden rounded-3xl bg-cream ring-1 ring-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
            <span className="relative block aspect-4/3 overflow-hidden">
                <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width:1280px) 405px, (min-width:768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
                />
            </span>
            <span className="flex flex-1 flex-col gap-2 p-6">
                <span className="text-xs font-semibold text-brand">{c.eyebrow}</span>
                <h3 className="text-xl font-semibold text-black sm:text-2xl">{c.title}</h3>
                <p className="text-sm leading-loose text-black/60">{c.description}</p>
                <span className="mt-auto pt-3">
                    <CtaLabel>{c.cta}</CtaLabel>
                </span>
            </span>
        </Link>
    );
}

interface CollectionBannersProps {
    collections?: Collection[];
    id?: string;
    className?: string;
}

export default function CollectionBanners({
    collections = DEFAULT_COLLECTIONS,
    id = "collections",
    className = "",
}: CollectionBannersProps) {
    const [first, ...rest] = collections;

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`scroll-mt-28 bg-white py-14 sm:py-20 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 text-center sm:mb-12">
                    <h2 id={`${id}-title`} className="text-3xl font-semibold text-black sm:text-4xl">
                        تسوّق حسب المجموعة
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-base leading-loose text-black/60">
                        من فنجان الصباح إلى حلى المساء، كل ما تحتاجه في مكان واحد.
                    </p>
                    <span aria-hidden className="mx-auto mt-6 block h-px w-24" style={{ backgroundImage: brandLine }} />
                </header>

                {first && <FeatureBanner c={first} />}

                {rest.length > 0 && (
                    <ul className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 md:grid-cols-3">
                        {rest.map((c) => (
                            <li key={c.id}>
                                <CollectionCard c={c} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

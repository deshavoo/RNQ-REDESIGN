import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { brandLine } from "./theme";

export interface GiftRecipient {
    id: string;
    label: string;
    href: string;
    image: string;
    alt: string;
}

const DEFAULT_RECIPIENTS: GiftRecipient[] = [
    { id: "father", label: "للأب", href: "/products/barns", image: "/images/gifts/father.webp", alt: "أب وابنه يتشاركان علبة شوكولاتة" },
    { id: "mother", label: "للأم", href: "/products/saadeddin?type=gifts", image: "/images/gifts/mother.webp", alt: "ابنة تقبّل والدتها بجانب علبة شوكولاتة سعد الدين" },
    { id: "friends", label: "للأصدقاء", href: "/products/saadeddin?type=sweets", image: "/images/gifts/friends.webp", alt: "صديقتان تتبادلان علبة تمر بالشوكولاتة" },
    { id: "colleagues", label: "للزملاء", href: "/products/barns?type=beans", image: "/images/gifts/colleagues.webp", alt: "زميلتان في المكتب مع علبة تمر بالشوكولاتة" },
    { id: "kids", label: "للأطفال", href: "/products/saadeddin?type=cakes", image: "/images/gifts/kids.webp", alt: "طفلة تفتح علبة شوكولاتة على شكل دبدوب" },
    { id: "companies", label: "للشركات", href: "/business/register", image: "/images/gifts/companies.webp", alt: "علب شوكولاتة سعد الدين لهدايا الشركات" },
];

interface GiftFinderProps {
    recipients?: GiftRecipient[];
    id?: string;
    className?: string;
}

export default function GiftFinder({ recipients = DEFAULT_RECIPIENTS, id = "gifts", className = "" }: GiftFinderProps) {
    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`scroll-mt-28 bg-cream py-14 sm:py-20 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-12">
                    <h2 id={`${id}-title`} className="text-3xl font-semibold text-black sm:text-4xl">
                        هدية لكل من تحب
                    </h2>
                    <p className="max-w-md text-base leading-loose text-black/60">اختر لمن تهدي، ونقترح عليك ما يناسبه.</p>
                    <span aria-hidden className="block h-px w-24" style={{ backgroundImage: brandLine }} />
                </header>

                <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
                    {recipients.map((r) => (
                        <li key={r.id} className="w-32 shrink-0 snap-start sm:w-40 lg:w-auto">
                            <Link
                                href={r.href}
                                className="group flex flex-col items-center gap-3 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
                            >
                                <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-white ring-2 ring-brand/15 transition-[box-shadow] duration-300 group-hover:ring-4 group-hover:ring-brand">
                                    <Image
                                        src={r.image}
                                        alt={r.alt}
                                        fill
                                        sizes="(min-width:1024px) 180px, 160px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transform-none"
                                    />
                                </span>
                                <span className="text-base font-semibold text-black transition-colors duration-300 group-hover:text-brand sm:text-lg">
                                    {r.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 text-center">
                    <Link
                        href="/products/saadeddin?type=gifts"
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-brand/60 px-7 text-sm font-bold text-brand-deep transition-colors duration-300 hover:border-transparent hover:bg-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:text-base"
                    >
                        تصفّح كل الهدايا
                        <ArrowLeft size={16} aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}

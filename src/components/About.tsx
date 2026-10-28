import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AboutBrand {
    id: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    image: string;
    alt: string;
}

export interface AboutValue {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface AboutFact {
    value: string;
    label: string;
}

const DEFAULT_BRANDS: AboutBrand[] = [
    {
        id: "barns",
        title: "قهوة بارنيز",
        description: "قهوة مختصة: حبوب ومطحونة وأدوات تحضير، لكوب يليق بضيافتك.",
        cta: "تعرّف على بارنيز",
        href: "/products/barns",
        image: "/images/best-barns.jpg",
        alt: "قهوة بارنيز المختصة",
    },
    {
        id: "saadeddin",
        title: "حلويات سعد الدين",
        description: "تمور وحلويات شرقية وعلب هدايا، بتغليف يليق بالمناسبة.",
        cta: "تعرّف على سعد الدين",
        href: "/products/saadeddin",
        image: "/images/best-saadeddin.jpg",
        alt: "حلويات وتمور سعد الدين",
    },
];

const DEFAULT_VALUES: AboutValue[] = [
    {
        title: "اختيار بعناية",
        description: "نختار ما نقدّمه بعناية، ليكون مناسباً لضيافتك وهداياك.",
        icon: Award,
    },
    {
        title: "لك ولشركتك",
        description: "نخدم الأفراد والشركات، من علبة هدية واحدة إلى التوريد بالجملة.",
        icon: Users,
    },
    {
        title: "من الرياض إليك",
        description: "نجهّز طلباتك ونرسلها من الرياض، مغلّفة كما تحب.",
        icon: MapPin,
    },
];

interface AboutProps {
    brands?: AboutBrand[];
    values?: AboutValue[];
    facts?: AboutFact[];
    contactHref?: string;
    siteUrl?: string;
    id?: string;
    className?: string;
}

export default function About({
    brands = DEFAULT_BRANDS,
    values = DEFAULT_VALUES,
    facts,
    contactHref,
    siteUrl,
    id = "about",
    className = "",
}: AboutProps) {
    const jsonLd = siteUrl
        ? {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "مجموعة RNQ للتجارة",
            url: siteUrl,
            address: { "@type": "PostalAddress", addressLocality: "الرياض", addressCountry: "SA" },
            brand: brands.map((b) => ({ "@type": "Brand", name: b.title, url: new URL(b.href, siteUrl).toString() })),
        }
        : null;

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`relative scroll-mt-28 bg-brand py-16 text-white [contain-intrinsic-size:auto_1400px] [content-visibility:auto] sm:py-24 ${className}`}
        >
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ backgroundImage: "linear-gradient(90deg,transparent,#c9ddd0,transparent)" }}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-16">
                    <div>
                        <h2 id={`${id}-title`} className="text-3xl font-semibold sm:text-4xl">
                            من نحن
                        </h2>
                        <span aria-hidden className="mt-5 block h-px w-24" style={{ backgroundImage: "linear-gradient(90deg,transparent,#c9ddd0,transparent)" }} />
                    </div>

                    <div>
                        <p className="text-2xl font-semibold leading-snug sm:text-4xl sm:leading-snug">
                            قهوة مختصة من بارنيز، وحلويات وتمور من سعد الدين، تصلك من الرياض إلى بيتك أو شركتك.
                        </p>
                        <p className="mt-6 max-w-2xl text-base leading-loose text-white/70 sm:text-lg">
                            مجموعة RNQ للتجارة تجمع علامتين تحت سقف واحد، لتجد في مكان واحد ما تحتاجه لضيافتك وهداياك،
                            سواء كنت تجهّز لمناسبة، أو تبحث عن توريد وهدايا لعملاء شركتك.
                        </p>

                        {contactHref && (
                            <Link
                                href={contactHref}
                                className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full px-7 text-sm font-bold bg-white text-brand transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(201,221,208,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand sm:text-base"
                            >
                                تواصل معنا
                                <ArrowLeft size={18} aria-hidden />
                            </Link>
                        )}
                    </div>
                </div>

                {facts && facts.length > 0 && (
                    <dl className="mt-14 grid grid-cols-2 gap-8 border-y border-brand-soft/25 py-8 sm:grid-cols-4">
                        {facts.map((f) => (
                            <div key={f.label}>
                                <dt className="text-sm text-white/60">{f.label}</dt>
                                <dd className="mt-1 text-3xl font-semibold text-brand-soft sm:text-4xl">{f.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <ul className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2 lg:gap-8">
                    {brands.map((b) => (
                        <li key={b.id} className="flex">
                            <Link
                                href={b.href}
                                className="group flex w-full flex-col overflow-hidden rounded-3xl border border-brand-soft/25 bg-white/3 transition-colors duration-500 hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                            >
                                <span className="relative block aspect-4/3 w-full overflow-hidden bg-brand">
                                    <Image
                                        src={b.image}
                                        alt={b.alt}
                                        fill
                                        sizes="(min-width:1280px) 608px, (min-width:768px) 48vw, 100vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                                    />
                                </span>
                                <span className="flex flex-1 flex-col items-start gap-4 p-6 sm:p-8">
                                    <h3 className="text-2xl font-semibold">{b.title}</h3>
                                    <p className="max-w-sm text-base leading-loose text-white/70">{b.description}</p>
                                    <span
                                        aria-hidden
                                        className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-brand-soft"
                                    >
                                        {b.cta}
                                        <ArrowLeft
                                            size={16}
                                            className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
                                        />
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <ul className="mt-14 grid gap-8 border-t border-brand-soft/25 pt-10 sm:mt-16 md:grid-cols-3 md:gap-10">
                    {values.map(({ title, description, icon: Icon }) => (
                        <li key={title} className="flex items-start gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-soft/40 text-brand-soft">
                                <Icon size={20} strokeWidth={1.6} aria-hidden />
                            </span>
                            <span>
                                <h3 className="text-base font-semibold">{title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-white/65">{description}</p>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
                />
            )}
        </section>
    );
}

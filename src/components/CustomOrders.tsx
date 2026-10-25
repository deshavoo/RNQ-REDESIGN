import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gift, MessageCircle, Package, Palette, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { goldFill, goldLine } from "./theme";
export interface CustomImage {
    src: string;
    alt: string;
}

export interface CustomOption {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface CustomStep {
    title: string;
    description: string;
}
const DEFAULT_MAIN: CustomImage = {
    src: "/images/custom-main.jpg",
    alt: "علبة هدايا مخصصة من القهوة والحلويات بتغليف فاخر وبطاقة مكتوبة بخط اليد",
};
const DEFAULT_DETAIL: CustomImage = {
    src: "/images/custom-detail.jpg",
    alt: "تفصيل لشريط ذهبي وختم وبطاقة على علبة هدية",
};

const DEFAULT_OPTIONS: CustomOption[] = [
    { title: "التغليف", description: "علب وأشرطة وألوان تختارها لمناسبتك.", icon: Gift },
    { title: "الشعار والتصميم", description: "اسمك أو شعار شركتك على العلبة والبطاقة.", icon: Palette },
    { title: "رسالة مكتوبة", description: "بطاقة بكلمات تقولها بصوتك.", icon: PenLine },
    { title: "التشكيلة والكمية", description: "تمور وحلويات وقهوة بالتوليفة التي تناسبك.", icon: Package },
];

const DEFAULT_STEPS: CustomStep[] = [
    { title: "أخبرنا بفكرتك", description: "المناسبة والكمية وما تحب أن تضمّه الهدية." },
    { title: "نقترح عليك", description: "تصميم وتشكيلة وعرض سعر واضح لتراجعه." },
    { title: "تعتمد ونجهّز", description: "نبدأ التجهيز بعد موافقتك على التفاصيل." },
    { title: "يصلك طلبك", description: "يخرج من الرياض إليك مغلّفاً كما اتفقنا." },
];
interface CustomOrdersProps {
    mainImage?: CustomImage;
    detailImage?: CustomImage;
    options?: CustomOption[];
    steps?: CustomStep[];
    ctaHref?: string;
    whatsappHref?: string;
    siteUrl?: string;
    id?: string;
    className?: string;
}

export default function CustomOrders({
    mainImage = DEFAULT_MAIN,
    detailImage = DEFAULT_DETAIL,
    options = DEFAULT_OPTIONS,
    steps = DEFAULT_STEPS,
    ctaHref = "/custom-orders",
    whatsappHref,
    siteUrl,
    id = "custom-orders",
    className = "",
}: CustomOrdersProps) {
    const jsonLd = siteUrl
        ? {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "طلبات مخصصة حسب الطلب",
            serviceType: "هدايا وتغليف مخصص للقهوة والحلويات والتمور",
            url: new URL(ctaHref, siteUrl).toString(),
            provider: { "@type": "Organization", name: "مجموعة RNQ للتجارة", url: siteUrl },
        }
        : null;

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`relative scroll-mt-28 bg-white py-16 text-black [contain-intrinsic-size:auto_1500px] [content-visibility:auto] sm:py-24 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
                    <div>
                        <h2 id={`${id}-title`} className="text-4xl font-semibold leading-tight sm:text-5xl">
                            حسب الطلب
                        </h2>
                        <span aria-hidden className="mt-5 block h-px w-24" style={{ backgroundImage: goldLine }} />
                        <p className="mt-6 max-w-lg text-lg leading-loose text-black/70 sm:text-xl">
                            اصنع هديتك كما تتخيلها. نجهّز القهوة والحلويات والتمور بتغليف ورسالة وتشكيلة تخصّك وحدك.
                        </p>

                        <ul className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                            {options.map(({ title, description, icon: Icon }) => (
                                <li key={title} className="flex items-start gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-black/3 text-gold-deep">
                                        <Icon size={20} strokeWidth={1.6} aria-hidden />
                                    </span>
                                    <span>
                                        <span className="block text-base font-semibold">{title}</span>
                                        <span className="mt-1 block text-sm leading-relaxed text-black/60">{description}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <Link
                                href={ctaHref}
                                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full px-8 text-base font-bold text-black transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                style={{ backgroundImage: goldFill }}
                            >
                                ابدأ طلبك الخاص
                                <ArrowLeft size={18} aria-hidden />
                            </Link>
                            {whatsappHref && (
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-black/25 px-8 text-base font-bold text-black transition-colors duration-300 hover:border-gold hover:text-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                >
                                    <MessageCircle size={18} aria-hidden />
                                    تحدّث معنا على واتساب
                                    <span className="sr-only">(يفتح في نافذة جديدة)</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md pb-10 lg:max-w-none">
                        <div className="relative isolate">
                            <span
                                aria-hidden
                                className="absolute inset-0 -z-10 -translate-x-3 translate-y-3 rounded-t-[50%/28%] rounded-b-3xl border border-gold/60 lg:-translate-x-5 lg:translate-y-5"
                            />
                            <div className="relative aspect-4/5 overflow-hidden rounded-t-[50%/28%] rounded-b-3xl bg-[#f6f1e4]">
                                <Image
                                    src={mainImage.src}
                                    alt={mainImage.alt}
                                    fill
                                    sizes="(min-width:1280px) 560px, (min-width:1024px) 45vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-3 aspect-square w-[36%] overflow-hidden rounded-3xl bg-[#f6f1e4] ring-8 ring-white sm:-right-4">
                            <Image
                                src={detailImage.src}
                                alt={detailImage.alt}
                                fill
                                sizes="(min-width:1024px) 220px, 36vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-16 rounded-3xl border border-gold/25 bg-[#faf7ee] p-6 sm:mt-20 sm:p-10">
                    <h3 className="text-xl font-semibold sm:text-2xl">كيف يتم طلبك؟</h3>
                    <ol className="mt-8 grid gap-8 lg:grid-cols-4 lg:gap-6">
                        {steps.map((s, i) => (
                            <li key={s.title}>
                                <div className="flex items-center gap-3">
                                    <span
                                        aria-hidden
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-black"
                                        style={{ backgroundImage: goldFill }}
                                    >
                                        {i + 1}
                                    </span>
                                    {i < steps.length - 1 && (
                                        <span
                                            aria-hidden
                                            className="hidden h-px flex-1 lg:block"
                                            style={{ backgroundImage: goldLine }}
                                        />
                                    )}
                                </div>
                                <h4 className="mt-4 text-base font-semibold">{s.title}</h4>
                                <p className="mt-1 max-w-64 text-sm leading-relaxed text-black/60">{s.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
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

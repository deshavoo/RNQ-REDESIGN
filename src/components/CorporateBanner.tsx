import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, PackageCheck, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PERKS: { text: string; icon: LucideIcon }[] = [
    { text: "تغليف بشعار شركتك", icon: Building2 },
    { text: "كميات كبيرة بأسعار خاصة", icon: PackageCheck },
    { text: "فاتورة ضريبية وعرض سعر مفصّل", icon: Receipt },
];

interface CorporateBannerProps {
    registerHref?: string;
    quoteHref?: string;
    id?: string;
    className?: string;
}

export default function CorporateBanner({
    registerHref = "/business/register",
    quoteHref = "/quote",
    id = "corporate",
    className = "",
}: CorporateBannerProps) {
    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            className={`relative isolate scroll-mt-28 overflow-hidden bg-brand py-16 text-white sm:py-24 ${className}`}
        >
            <span
                aria-hidden
                className="pointer-events-none absolute -top-32 inset-s-0 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"
            />

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-8">
                <div>
                    <p className="text-sm font-semibold text-brand-soft">قطاع الأعمال</p>
                    <h2 id={`${id}-title`} className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                        هدايا وضيافة الشركات
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-loose text-white/75 sm:text-lg">
                        نجهّز ضيافة اجتماعاتك وهدايا عملائك وفريقك من قهوة بارنيز وحلويات سعد الدين، بالكمية والتغليف الذي تحتاجه.
                    </p>

                    <ul className="mt-8 space-y-4">
                        {PERKS.map(({ text, icon: Icon }) => (
                            <li key={text} className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-brand-soft">
                                    <Icon size={18} strokeWidth={1.7} aria-hidden />
                                </span>
                                <span className="text-base text-white/90">{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href={quoteHref}
                            className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-white px-8 text-base font-bold text-brand transition-colors duration-300 hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                        >
                            اطلب عرض سعر
                            <ArrowLeft size={18} aria-hidden />
                        </Link>
                        <Link
                            href={registerHref}
                            className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/40 px-8 text-base font-bold text-white transition-colors duration-300 hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                        >
                            سجّل حساب شركة
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    <div className="relative aspect-3/4 overflow-hidden rounded-3xl ring-1 ring-white/15">
                        <Image
                            src="/images/company.jpg"
                            alt="ضيافة قهوة وحلويات في اجتماع شركة"
                            fill
                            sizes="(min-width:1024px) 320px, 50vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="relative mt-10 aspect-3/4 overflow-hidden rounded-3xl ring-1 ring-white/15 sm:mt-16">
                        <Image
                            src="/images/business-banner.jpg"
                            alt="علب هدايا بشعار الشركة"
                            fill
                            sizes="(min-width:1024px) 320px, 50vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

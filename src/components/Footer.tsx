import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { BRANDS } from "./brands";
import { goldFill, goldLine } from "./theme";

export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterSocial {
    label: string;
    href: string;
    icon: ReactNode;
}

export interface FooterContact {
    phone: string;
    email: string;
    address: string;
    whatsapp?: string;
}

interface FooterProps {
    logo?: { src: string; alt?: string; width?: number; height?: number };
    contact?: FooterContact;
    socials?: FooterSocial[];
    quoteHref?: string;
    className?: string;
}

const DEFAULT_LOGO = { src: "/MyLogo.png", alt: "شعار مجموعة RNQ للتجارة", width: 180, height: 70 };

const DEFAULT_CONTACT: FooterContact = {
    phone: "+966 50 000 0000",
    email: "info@example.com",
    address: "الرياض، المملكة العربية السعودية",
    whatsapp: "966500000000",
};

const QUICK_LINKS: FooterLink[] = [
    { label: "المنتجات", href: "/products" },
    { label: "حلول الشركات", href: "/business" },
    { label: "المناسبات", href: "/#occasions" },
    { label: "حسب الطلب", href: "/custom-orders" },
    { label: "من نحن", href: "/#about" },
    { label: "تواصل معنا", href: "/contact" },
];

const LEGAL_LINKS: FooterLink[] = [
    { label: "سياسة الخصوصية", href: "/legal/privacy" }, // يمكنك تغييرها لاحقاً لو أنشأت مجلد privacy مستقل
    { label: "الشروط والأحكام", href: "/legal/terms" },
    { label: "الاستبدال والاسترجاع", href: "/legal/returns" },
    { label: "الشحن والتوصيل", href: "/legal/shipping" },
];

const svgProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const InstagramIcon = (
    <svg {...svgProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
);

const XIcon = (
    <svg {...svgProps}>
        <path d="M5 4l14 16M19 4L5 20" />
    </svg>
);

const TikTokIcon = (
    <svg {...svgProps}>
        <path d="M15 3v10.5a4 4 0 1 1-4-4M15 3c.4 2.6 2 4.4 5 4.8" />
    </svg>
);

const DEFAULT_SOCIALS: FooterSocial[] = [
    { label: "إنستجرام", href: "https://instagram.com/", icon: InstagramIcon },
    { label: "إكس", href: "https://x.com/", icon: XIcon },
    { label: "تيك توك", href: "https://tiktok.com/", icon: TikTokIcon },
];

const linkClass =
    "inline-flex min-h-9 items-center text-sm text-white/70 transition-colors duration-300 hover:text-[#f5e3a1] focus:outline-none focus-visible:text-[#f5e3a1] focus-visible:underline";

const iconCircle =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/40 text-[#f5e3a1] transition-all duration-300 hover:border-transparent hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] hover:[background-image:linear-gradient(135deg,#f5e3a1,#d4af37_55%,#b8891f)]";

function ColumnTitle({ children }: { children: ReactNode }) {
    return <h2 className="mb-4 text-sm font-semibold text-gold">{children}</h2>;
}

export default function Footer({
    logo = DEFAULT_LOGO,
    contact = DEFAULT_CONTACT,
    socials = DEFAULT_SOCIALS,
    quoteHref = "/quote",
    className = "",
}: FooterProps) {
    const year = new Date().getFullYear();
    const brands = Object.values(BRANDS);

    return (
        <footer dir="rtl" lang="ar" className={`relative mt-auto overflow-hidden bg-black text-white ${className}`}>
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ backgroundImage: goldLine }}
            />
            <span
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(110vw,70rem)] -translate-x-1/2 rounded-full blur-3xl"
                style={{
                    background:
                        "radial-gradient(closest-side,rgba(212,175,55,.22),rgba(212,175,55,.06) 60%,transparent)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-b border-white/10 py-12 sm:py-14">
                    <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-gold/30 bg-white/3 p-7 sm:flex-row sm:items-center sm:p-10">
                        <div className="max-w-xl">
                            <p className="text-xl font-semibold leading-snug sm:text-2xl">
                                تحتاج توريداً لشركتك أو فندقك؟
                            </p>
                            <p className="mt-2 text-sm leading-loose text-white/65 sm:text-base">
                                أرسل احتياجك وفريق الشركات يرجع لك بعرض سعر مفصّل خلال يوم عمل.
                            </p>
                        </div>
                        <Link
                            href={quoteHref}
                            className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full px-8 text-sm font-bold text-black shadow-[0_0_40px_-10px_rgba(212,175,55,0.8)] transition-[filter] duration-300 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-base"
                            style={{ backgroundImage: goldFill }}
                        >
                            اطلب عرض سعر
                            <ArrowLeft size={18} aria-hidden />
                        </Link>
                    </div>
                </div>

                <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
                    <div className="sm:col-span-2 lg:col-span-4">
                        <Link
                            href="/"
                            aria-label={logo.alt ?? "الصفحة الرئيسية"}
                            className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt ?? ""}
                                width={logo.width ?? 180}
                                height={logo.height ?? 70}
                                className="h-16 w-auto max-w-56 object-contain"
                            />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-loose text-white/65">
                            قهوة مختصة وحلويات فاخرة، تصلك من الرياض بجودة تليق بضيافتك. مجموعة تضم قهوة بارنيز
                            وحلويات سعد الدين.
                        </p>

                        <ul className="mt-6 flex items-center gap-3" aria-label="حساباتنا على وسائل التواصل">
                            {socials.map((s) => (
                                <li key={s.label}>
                                    <a
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className={iconCircle}
                                    >
                                        {s.icon}
                                    </a>
                                </li>
                            ))}
                            {contact.whatsapp && (
                                <li>
                                    <a
                                        href={`https://wa.me/${contact.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="واتساب"
                                        className={iconCircle}
                                    >
                                        <MessageCircle size={18} strokeWidth={1.7} aria-hidden />
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <nav aria-label="روابط سريعة" className="lg:col-span-2">
                        <ColumnTitle>روابط سريعة</ColumnTitle>
                        <ul className="flex flex-col">
                            {QUICK_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className={linkClass}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="المنتجات" className="lg:col-span-3">
                        <ColumnTitle>المنتجات</ColumnTitle>
                        <div className="flex flex-col gap-6">
                            {brands.map((b) => (
                                <div key={b.id}>
                                    <Link
                                        href={`/products/${b.id}`}
                                        className="inline-flex min-h-9 items-center text-sm font-semibold text-white transition-colors duration-300 hover:text-gold-soft focus:outline-none focus-visible:text-gold-soft focus-visible:underline"
                                    >
                                        {b.title}
                                    </Link>
                                    <ul className="flex flex-col">
                                        {b.categories.map((c) => (
                                            <li key={c.id}>
                                                <Link href={`/products/${b.id}?type=${c.id}`} className={linkClass}>
                                                    {c.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="lg:col-span-3">
                        <ColumnTitle>تواصل معنا</ColumnTitle>
                        <ul className="flex flex-col gap-4 text-sm text-white/70">
                            <li className="flex items-start gap-3">
                                <Phone size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                                <a
                                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                                    dir="ltr"
                                    className="transition-colors duration-300 hover:text-gold-soft focus:outline-none focus-visible:text-gold-soft focus-visible:underline"
                                >
                                    {contact.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="break-all transition-colors duration-300 hover:text-gold-soft focus:outline-none focus-visible:text-gold-soft focus-visible:underline"
                                >
                                    {contact.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                                <span className="leading-relaxed">{contact.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-white/50">
                        © {year} مجموعة RNQ للتجارة. جميع الحقوق محفوظة.
                    </p>
                    <nav aria-label="روابط قانونية">
                        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
                            {LEGAL_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="inline-flex min-h-9 items-center text-xs text-white/50 transition-colors duration-300 hover:text-gold-soft focus:outline-none focus-visible:text-gold-soft focus-visible:underline"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

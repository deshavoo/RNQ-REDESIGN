"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { FormEvent, MouseEvent } from "react";
import { Globe, Search, Menu, X, ShoppingBag, User, LogOut, Heart, ArrowLeft, ChevronDown, Coffee, Cookie, Gift, Truck, FileText, Building2, Package, Briefcase, } from "lucide-react";
import type { LucideIcon } from "lucide-react";
export interface MegaItem {
    label: string;
    href: string;
    description?: string;
    icon?: LucideIcon;
}

export interface MegaColumn {
    title: string;
    items: MegaItem[];
}

export interface MegaFeatured {
    title: string;
    description: string;
    href: string;
    cta: string;
    image?: string;
    badge?: string;
}

export interface MegaMenu {
    columns: MegaColumn[];
    featured?: MegaFeatured;
}

export interface NavLink {
    label: string;
    href: string;
    mega?: MegaMenu;
}

export interface NavbarLogo {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
}

export interface NavbarUser {
    name?: string | null;
}

export type Audience = "b2c" | "b2b";

export interface NavbarProps {
    logo?: NavbarLogo;
    links?: NavLink[];

    cartCount?: number;

    user?: NavbarUser | null;
    isAuthLoading?: boolean;

    homeHref?: string;
    cartHref?: string;
    profileHref?: string;
    favoritesHref?: string;
    loginHref?: string;
    quoteHref?: string;
    contactHref?: string;

    onSearch?: (query: string) => void;
    searchHref?: string;

    onNavigate?: (href: string) => void;
    onLogout?: () => void;

    onLanguageToggle?: () => void;
    languageLabel?: string;

    /** أفراد / شركات: controlled لو مررت audience، وإلا بيشتغل لوحده */
    audience?: Audience;
    onAudienceChange?: (audience: Audience) => void;

    labels?: Partial<typeof DEFAULT_LABELS>;
    className?: string;
}

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_LOGO: NavbarLogo = {
    src: "/MyLogo.png",
    alt: "شعار الموقع",
    width: 180,
    height: 70,
};

const DEFAULT_LABELS = {
    mainNav: "التنقل الرئيسي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    home: "الصفحة الرئيسية",
    searchPlaceholder: "ابحث...",
    searchPlaceholderMobile: "ابحث عن منتج...",
    searchLabel: "البحث عن المنتجات",
    openSearch: "فتح البحث",
    closeSearch: "إغلاق البحث",
    clearSearch: "مسح البحث",
    favorites: "المفضلة",
    cart: "سلة التسوق",
    login: "تسجيل الدخول",
    account: "حسابي",
    logout: "تسجيل الخروج",
    audienceGroup: "نوع العميل",
    audienceB2c: "للأفراد",
    audienceB2b: "للشركات",
    quote: "اطلب عرض سعر",
    contact: "تواصل معنا",
    viewAll: "عرض الكل",
    footer: "",
};

const DEFAULT_LINKS: NavLink[] = [
    {
        label: "المنتجات",
        href: "/products",
        mega: {
            columns: [
                {
                    title: "قهوة بارنيز",
                    items: [
                        { label: "حبوب القهوة", href: "/products/barns?type=beans", description: "تحميص طازج لكل ذوق", icon: Coffee },
                        { label: "القهوة المطحونة", href: "/products/barns?type=ground", description: "جاهزة لطريقة تحضيرك", icon: Package },
                        { label: "أدوات التحضير", href: "/products/barns?type=tools", description: "كل ما تحتاجه لكوب مثالي", icon: Coffee },
                    ],
                },
                {
                    title: "حلويات سعد الدين",
                    items: [
                        { label: "التمور", href: "/products/saadeddin?type=dates", description: "أجود الأصناف المنتقاة", icon: Cookie },
                        { label: "الحلويات الشرقية", href: "/products/saadeddin?type=sweets", description: "صناعة يدوية فاخرة", icon: Cookie },
                        { label: "علب الهدايا", href: "/products/saadeddin?type=gifts", description: "تغليف يليق بالمناسبة", icon: Gift },
                    ],
                },
            ],
            featured: {
                title: "كل منتجات المجموعة في مكان واحد",
                description: "اكتشف القهوة والحلويات والتمور من علامتين تجمعهما الجودة.",
                href: "/products",
                cta: "تصفح كل المنتجات",
                image: "/images/rnq-banner.jpg",
            },
        },
    },
    {
        label: "حلول الشركات",
        href: "/business",
        mega: {
            columns: [
                {
                    title: "التوريد والجملة",
                    items: [
                        { label: "توريد بالجملة", href: "/business/wholesale", description: "كميات كبيرة بأسعار خاصة", icon: Truck },
                        { label: "الفنادق والمقاهي", href: "/business/hospitality", description: "حلول مخصصة لقطاع الضيافة", icon: Building2 },
                    ],
                },
                {
                    title: "الهدايا والخدمات",
                    items: [
                        { label: "هدايا الشركات", href: "/business/corporate-gifts", description: "هدايا بشعار شركتك", icon: Gift },
                        { label: "فتح حساب شركة", href: "/business/register", description: "تسعير وطلبات متكررة", icon: Briefcase },
                    ],
                },
            ],
            featured: {
                title: "عرض سعر خلال يوم عمل",
                description: "أرسل احتياجك وفريق الشركات يرجع لك بعرض مفصّل.",
                href: "/quote",
                cta: "اطلب عرض سعر",
                image: "/images/business-banner.jpg",
            },
        },
    },
    { label: "المناسبات", href: "#occasions" },
    { label: "حسب الطلب", href: "#custom-orders" },
    { label: "من نحن", href: "#about" },
];

/* ------------------------------------------------------------------ */
/* Design tokens: white / black / gold                                 */
/* ------------------------------------------------------------------ */

const GOLD = "#d4af37";
const goldFill = "linear-gradient(135deg,#f5e3a1,#d4af37 55%,#b8891f)";
const goldLine = `linear-gradient(90deg,transparent,${GOLD}aa,transparent)`;

/* ------------------------------------------------------------------ */
/* Small internal pieces                                               */
/* ------------------------------------------------------------------ */

function AudienceSwitch({
    audience,
    onChange,
    labels,
    size = "sm",
}: {
    audience: Audience;
    onChange: (a: Audience) => void;
    labels: typeof DEFAULT_LABELS;
    size?: "sm" | "md";
}) {
    const options: { id: Audience; label: string }[] = [
        { id: "b2c", label: labels.audienceB2c },
        { id: "b2b", label: labels.audienceB2b },
    ];
    const pad = size === "md" ? "px-5 py-2.5 text-sm" : "px-4 py-1 text-xs";
    return (
        <div
            role="group"
            aria-label={labels.audienceGroup}
            className="inline-flex rounded-full border border-gold/30 bg-black/3 p-0.5"
        >
            {options.map((o) => {
                const active = audience === o.id;
                return (
                    <button
                        key={o.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(o.id)}
                        className={`rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${pad} ${active ? "text-black" : "text-black/60 hover:text-black"
                            }`}
                        style={active ? { backgroundImage: goldFill } : undefined}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

function MegaItemLink({
    item,
    onClick,
}: {
    item: MegaItem;
    onClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
    const Icon = item.icon;
    return (
        <a
            href={item.href}
            onClick={(e) => onClick(e, item.href)}
            className="group/item flex items-start gap-4 rounded-xl p-3 transition-colors duration-300 hover:bg-black/4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
            {Icon && (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-black/3 text-gold-deep transition-all duration-300 group-hover/item:border-transparent group-hover/item:bg-gold group-hover/item:text-black"
                >
                    <Icon size={20} strokeWidth={1.6} />
                </span>
            )}
            <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 text-[15px] font-bold text-black transition-colors group-hover/item:text-gold-deep">
                    {item.label}
                    <ArrowLeft
                        size={15}
                        className="shrink-0 text-gold-deep opacity-0 transition-all duration-300 group-hover/item:-translate-x-1 group-hover/item:opacity-100"
                    />
                </span>
                {item.description && (
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-black/55">{item.description}</span>
                )}
            </span>
        </a>
    );
}

function FeaturedCard({
    featured,
    onClick,
}: {
    featured: MegaFeatured;
    onClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
    return (
        <a
            href={featured.href}
            onClick={(e) => onClick(e, featured.href)}
            className="group/feat relative isolate flex h-full min-h-70 flex-col justify-end overflow-hidden rounded-2xl border border-gold/30 bg-black p-6 transition-shadow duration-500 hover:shadow-[0_0_50px_-12px_rgba(212,175,55,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
            {featured.image ? (
                <Image
                    src={featured.image}
                    alt=""
                    fill
                    sizes="380px"
                    className="-z-20 object-cover opacity-70 transition-transform duration-700 group-hover/feat:scale-105"
                />
            ) : (
                <span
                    aria-hidden
                    className="absolute inset-0 -z-20"
                    style={{
                        background:
                            "radial-gradient(ellipse at 80% 0%,rgba(212,175,55,.35),transparent 60%),#000",
                    }}
                />
            )}
            <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/70 to-black/10" />
            {featured.badge && (
                <span className="mb-3 w-fit rounded-full border border-gold/50 bg-black/50 px-3 py-1 text-xs font-semibold text-gold-soft backdrop-blur">
                    {featured.badge}
                </span>
            )}
            <span className="text-xl font-bold leading-snug text-white">{featured.title}</span>
            <span className="mt-2 text-sm leading-relaxed text-white/70">{featured.description}</span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold transition-all duration-300 group-hover/feat:gap-3">
                {featured.cta}
                <ArrowLeft size={16} />
            </span>
        </a>
    );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

export default function Navbar({
    logo = DEFAULT_LOGO,
    links = DEFAULT_LINKS,
    cartCount = 0,
    user = null,
    isAuthLoading = false,
    homeHref = "/",
    cartHref = "/cart",
    profileHref = "/profile",
    favoritesHref = "/profile",
    loginHref = "/auth",
    quoteHref = "/quote",
    contactHref = "/contact",
    onSearch,
    searchHref = "/products",
    onNavigate,
    onLogout,
    onLanguageToggle,
    languageLabel,
    audience: audienceProp,
    onAudienceChange,
    labels: labelsProp,
    className = "",
}: NavbarProps) {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMega, setActiveMega] = useState<number | null>(null);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [audienceState, setAudienceState] = useState<Audience>("b2c");

    const headerRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const safeItemCount = cartCount ?? 0;
    const isAuthenticated = !!user;
    const audience = audienceProp ?? audienceState;
    const firstName = user?.name?.split(" ")[0] || labels.account;

    const changeAudience = (a: Audience) => {
        setAudienceState(a);
        onAudienceChange?.(a);
    };

    /* ----- mega timers ----- */
    const clearCloseTimer = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    const openMega = useCallback(
        (i: number) => {
            clearCloseTimer();
            setActiveMega(i);
        },
        [clearCloseTimer]
    );

    const closeMega = useCallback(() => {
        clearCloseTimer();
        setActiveMega(null);
    }, [clearCloseTimer]);

    const scheduleClose = useCallback(() => {
        clearCloseTimer();
        closeTimer.current = setTimeout(() => setActiveMega(null), 140);
    }, [clearCloseTimer]);

    useEffect(() => clearCloseTimer, [clearCloseTimer]);

    /* ----- scroll state ----- */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ----- lock body scroll while the drawer is open ----- */
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);

    /* ----- inert via ref so it works on React 18 and 19 ----- */
    useEffect(() => {
        if (mobileMenuRef.current) {
            (mobileMenuRef.current as HTMLElement & { inert: boolean }).inert = !isMobileMenuOpen;
        }
    }, [isMobileMenuOpen]);

    /* ----- Esc ----- */
    useEffect(() => {
        if (!isMobileMenuOpen && !isSearchOpen && activeMega === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (activeMega !== null) {
                triggerRefs.current[activeMega]?.focus();
                closeMega();
            }
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            }
            if (isSearchOpen) setIsSearchOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileMenuOpen, isSearchOpen, activeMega, closeMega]);

    /* ----- click outside closes mega + search ----- */
    useEffect(() => {
        if (activeMega === null && !isSearchOpen) return;
        const handlePointerDown = (e: PointerEvent) => {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                closeMega();
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [activeMega, isSearchOpen, closeMega]);

    /* ----- close drawer when the screen reaches lg ----- */
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsMobileMenuOpen(false);
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    /* ----- auto focus search ----- */
    useEffect(() => {
        if (isSearchOpen) searchInputRef.current?.focus();
    }, [isSearchOpen]);

    const navigate = useCallback(
        (href: string) => {
            if (onNavigate) onNavigate(href);
            else window.location.assign(href);
        },
        [onNavigate]
    );

    const handleSearchSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const trimmed = searchQuery.trim();
            if (!trimmed) return;
            if (onSearch) onSearch(trimmed);
            else navigate(`${searchHref}?search=${encodeURIComponent(trimmed)}`);
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
        },
        [searchQuery, onSearch, navigate, searchHref]
    );

    const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.getElementById(href.slice(1));
            if (element) element.scrollIntoView({ behavior: "smooth" });
            else navigate(`${homeHref}${href}`);
        } else if (onNavigate) {
            e.preventDefault();
            onNavigate(href);
        }
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        closeMega();
    };

    const handleTriggerClick = (e: MouseEvent<HTMLButtonElement>, i: number) => {
        const isMouse = (e.nativeEvent as PointerEvent).pointerType === "mouse";
        clearCloseTimer();
        // mouse: hover already opened it, so a click keeps it open. touch/keyboard: toggle.
        setActiveMega((prev) => (prev === i && !isMouse ? null : i));
    };

    /* ----- shared classes ----- */
    // نفس اللون للشريط العلوي والنافبار: أبيض مصمت (الشفافية كانت بتطلع رمادي فوق الخلفية الغامقة)
    const surface = "bg-white";
    const iconBtn =
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black/80 transition-colors duration-300 hover:bg-black/5 hover:text-[#8a6a1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]";
    const goldPill =
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#d4af37]/50 bg-black px-3 text-xs font-bold text-[#f5e3a1] transition-all duration-300 hover:border-transparent hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black lg:px-4 hover:[background-image:linear-gradient(135deg,#f5e3a1,#d4af37_55%,#b8891f)]";

    return (
        <>
            {/* ---------- Utility bar (desktop): normal flow, scrolls away; the sticky header never changes height ---------- */}
            <div className={`hidden transition-colors duration-300 lg:block ${surface}`}>
                <div
                    dir="rtl"
                    className="mx-auto flex h-11 max-w-7xl items-center justify-between px-8"
                >
                    <AudienceSwitch audience={audience} onChange={changeAudience} labels={labels} />
                    <div className="flex items-center gap-6 text-xs text-black/60">
                        <a
                            href={contactHref}
                            onClick={(e) => handleLinkClick(e, contactHref)}
                            className="transition-colors hover:text-gold-deep focus:outline-none focus-visible:text-gold-deep"
                        >
                            {labels.contact}
                        </a>
                        {onLanguageToggle && (
                            <button
                                type="button"
                                onClick={onLanguageToggle}
                                aria-label={languageLabel ?? "English"}
                                className="flex items-center gap-1.5 font-semibold transition-colors hover:text-gold-deep focus:outline-none focus-visible:text-gold-deep"
                            >
                                <Globe size={14} strokeWidth={1.8} />
                                {languageLabel ?? "EN"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <header
                ref={headerRef}
                className={`sticky top-0 z-50 w-full transform-gpu text-black backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ${isScrolled ? "bg-white/95 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.25)]" : surface
                    } ${className}`}
            >
                {/* ---------- Main bar ---------- */}
                <nav
                    dir="rtl"
                    aria-label={labels.mainNav}
                    className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:h-24 lg:gap-8 lg:px-8"
                >
                    <button
                        ref={menuButtonRef}
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label={isMobileMenuOpen ? labels.closeMenu : labels.openMenu}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 text-gold-deep transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Logo: centered on mobile, at the start on desktop */}
                    <a
                        href={homeHref}
                        onClick={(e) => handleLinkClick(e, homeHref)}
                        aria-label={logo.alt ?? labels.home}
                        className="z-10 flex shrink-0 items-center justify-center transition-opacity duration-300 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
                    >
                        <Image
                            src={logo.src}
                            alt={logo.alt ?? ""}
                            width={logo.width ?? 180}
                            height={logo.height ?? 70}
                            priority
                            className={
                                logo.className ??
                                "h-12 w-auto max-w-[42vw] object-contain sm:h-14 lg:h-18 lg:max-w-64"
                            }
                        />
                    </a>

                    {/* ---------- Desktop links + mega ---------- */}
                    <ul className="hidden h-full flex-1 items-center gap-1 lg:flex">
                        {links.map((link, i) => {
                            const mega = link.mega;
                            const isOpen = activeMega === i;
                            const panelId = `mega-panel-${i}`;
                            const linkClass =
                                "group relative flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-black/85 transition-colors duration-300 hover:text-[#8a6a1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]";
                            const underline = (
                                <span
                                    aria-hidden="true"
                                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-center transition-transform duration-300 ${isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    style={{ backgroundImage: goldLine }}
                                />
                            );

                            return (
                                <li
                                    key={link.label}
                                    className="flex h-full items-center"
                                    onPointerEnter={(e) => {
                                        if (e.pointerType !== "mouse") return;
                                        if (mega) openMega(i);
                                        else closeMega();
                                    }}
                                    onPointerLeave={(e) => {
                                        if (e.pointerType === "mouse" && mega) scheduleClose();
                                    }}
                                    onBlur={(e) => {
                                        if (mega && !e.currentTarget.contains(e.relatedTarget as Node | null)) {
                                            closeMega();
                                        }
                                    }}
                                >
                                    {mega ? (
                                        <button
                                            ref={(el) => {
                                                triggerRefs.current[i] = el;
                                            }}
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-haspopup="true"
                                            aria-controls={panelId}
                                            onClick={(e) => handleTriggerClick(e, i)}
                                            className={`${linkClass} ${isOpen ? "text-gold-deep" : ""}`}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={14}
                                                strokeWidth={2.2}
                                                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                            {underline}
                                        </button>
                                    ) : (
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleLinkClick(e, link.href)}
                                            className={linkClass}
                                        >
                                            {link.label}
                                            {underline}
                                        </a>
                                    )}

                                    {mega && (
                                        <div
                                            id={panelId}
                                            role="region"
                                            aria-label={link.label}
                                            className={`absolute inset-x-0 top-full z-10 border-t border-gold/20 bg-white/95 backdrop-blur-2xl transition-[opacity,transform,visibility] duration-300 ease-out ${isOpen
                                                ? "visible translate-y-0 opacity-100"
                                                : "invisible -translate-y-2 opacity-0"
                                                }`}
                                        >
                                            <span
                                                aria-hidden
                                                className="pointer-events-none absolute inset-0"
                                                style={{
                                                    background:
                                                        "radial-gradient(ellipse at 15% 0%,rgba(212,175,55,.14),transparent 55%)",
                                                }}
                                            />
                                            <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-10 px-8 py-10">
                                                <div
                                                    className={`grid gap-10 ${mega.featured ? "col-span-8" : "col-span-12"
                                                        }`}
                                                    style={{
                                                        gridTemplateColumns: `repeat(${mega.columns.length},minmax(0,1fr))`,
                                                    }}
                                                >
                                                    {mega.columns.map((col) => (
                                                        <div key={col.title}>
                                                            <p className="mb-3 border-b border-black/10 pb-3 text-sm font-bold text-gold-deep">
                                                                {col.title}
                                                            </p>
                                                            <ul className="flex flex-col gap-1">
                                                                {col.items.map((item) => (
                                                                    <li key={item.href}>
                                                                        <MegaItemLink item={item} onClick={handleLinkClick} />
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                    <a
                                                        href={link.href}
                                                        onClick={(e) => handleLinkClick(e, link.href)}
                                                        className="col-span-full -mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold text-black/65 transition-colors hover:text-gold-deep focus:outline-none focus-visible:text-gold-deep"
                                                    >
                                                        {labels.viewAll} {link.label}
                                                        <ArrowLeft size={15} />
                                                    </a>
                                                </div>
                                                {mega.featured && (
                                                    <div className="col-span-4">
                                                        <FeaturedCard featured={mega.featured} onClick={handleLinkClick} />
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                aria-hidden
                                                className="absolute inset-x-0 bottom-0 h-px"
                                                style={{ backgroundImage: goldLine }}
                                            />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* ---------- Tools ---------- */}
                    {/* dir="ltr" => ms-auto كان بيرمي الأدوات يمين. mr-auto (فيزيائي) بيزقها لأقصى الشمال في الموبايل */}
                    <div dir="ltr" className="mr-auto flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                        {audience === "b2b" && (
                            <a
                                href={quoteHref}
                                onClick={(e) => handleLinkClick(e, quoteHref)}
                                className="me-1 hidden h-10 items-center gap-2 rounded-full px-5 text-sm font-bold text-black shadow-[0_0_30px_-8px_rgba(212,175,55,0.7)] transition-all duration-300 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-black xl:inline-flex"
                                style={{ backgroundImage: goldFill }}
                            >
                                <FileText size={16} strokeWidth={2} />
                                {labels.quote}
                            </a>
                        )}

                        {/* Search (desktop) */}
                        <form
                            onSubmit={handleSearchSubmit}
                            role="search"
                            className={`hidden h-10 shrink-0 items-center overflow-hidden rounded-full border transition-all duration-500 ease-out lg:flex ${isSearchOpen
                                ? "w-60 border-gold/60 bg-black/4"
                                : "w-10 border-transparent"
                                }`}
                        >
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen((prev) => !prev)}
                                aria-label={isSearchOpen ? labels.closeSearch : labels.openSearch}
                                aria-expanded={isSearchOpen}
                                className={`${iconBtn} h-9.5 w-9.5`}
                            >
                                {isSearchOpen ? <X size={18} strokeWidth={1.9} /> : <Search size={19} strokeWidth={1.9} />}
                            </button>
                            <input
                                ref={searchInputRef}
                                type="search"
                                dir="rtl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={labels.searchPlaceholder}
                                aria-label={labels.searchLabel}
                                tabIndex={isSearchOpen ? 0 : -1}
                                className="min-w-0 flex-1 bg-transparent pe-3 text-sm text-black outline-none placeholder:text-black/45"
                            />
                        </form>

                        <a
                            href={favoritesHref}
                            onClick={(e) => handleLinkClick(e, favoritesHref)}
                            aria-label={labels.favorites}
                            className={`${iconBtn} hidden lg:flex`}
                        >
                            <Heart size={20} strokeWidth={1.8} />
                        </a>

                        <a
                            href={cartHref}
                            onClick={(e) => handleLinkClick(e, cartHref)}
                            aria-label={`${labels.cart} (${safeItemCount})`}
                            className={iconBtn}
                        >
                            <ShoppingBag size={20} strokeWidth={1.8} />
                            {safeItemCount > 0 && (
                                <span
                                    className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-black"
                                    style={{ backgroundImage: goldFill }}
                                >
                                    {safeItemCount > 99 ? "99+" : safeItemCount}
                                </span>
                            )}
                        </a>

                        {isAuthLoading ? (
                            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-black/10" />
                        ) : isAuthenticated ? (
                            <div className="flex shrink-0 items-center gap-1">
                                <a
                                    href={profileHref}
                                    onClick={(e) => handleLinkClick(e, profileHref)}
                                    aria-label={labels.account}
                                    className={goldPill}
                                >
                                    <User size={17} strokeWidth={2} className="shrink-0" />
                                    <span className="hidden max-w-30 truncate sm:inline-block">{firstName}</span>
                                </a>
                                {onLogout && (
                                    <button
                                        type="button"
                                        onClick={onLogout}
                                        title={labels.logout}
                                        aria-label={labels.logout}
                                        className={`${iconBtn} hidden lg:flex`}
                                    >
                                        <LogOut size={18} strokeWidth={1.8} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <a
                                href={loginHref}
                                onClick={(e) => handleLinkClick(e, loginHref)}
                                aria-label={labels.login}
                                title={labels.login}
                                className={goldPill}
                            >
                                <User size={17} strokeWidth={2} className="shrink-0" />
                                <span className="hidden sm:inline-block">{labels.login}</span>
                            </a>
                        )}
                    </div>
                </nav>

                {/* gold hairline under the header */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                    style={{ backgroundImage: goldLine }}
                />

            </header>

            {/* page dim while a mega menu is open (fixed, outside the header, so it can't affect scroll height) */}
            <div
                aria-hidden
                className={`pointer-events-none fixed inset-0 z-40 hidden bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 lg:block ${activeMega !== null ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* ---------- Mobile drawer (outside header: backdrop-filter breaks position:fixed) ---------- */}
            <div
                ref={mobileMenuRef}
                id="mobile-menu"
                dir="rtl"
                role="dialog"
                aria-modal="true"
                aria-label={labels.mainNav}
                aria-hidden={!isMobileMenuOpen}
                className={`fixed inset-0 z-60 transition-[visibility] lg:hidden ${isMobileMenuOpen ? "visible delay-0" : "pointer-events-none invisible delay-500"
                    }`}
            >
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                <div
                    className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col border-l border-gold/30 bg-white shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(.22,.8,.3,1)] ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: "radial-gradient(ellipse at 100% 0%,rgba(212,175,55,.16),transparent 55%)",
                        }}
                    />

                    {/* drawer header */}
                    <div className="relative flex h-20 shrink-0 items-center justify-between border-b border-black/10 px-5">
                        <a
                            href={homeHref}
                            onClick={(e) => handleLinkClick(e, homeHref)}
                            aria-label={logo.alt ?? labels.home}
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt ?? ""}
                                width={logo.width ?? 180}
                                height={logo.height ?? 70}
                                className="h-12 w-auto max-w-48 object-contain"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                menuButtonRef.current?.focus();
                            }}
                            aria-label={labels.closeMenu}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 text-gold-deep transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-6">
                        <div className="mb-5 flex justify-center">
                            <AudienceSwitch audience={audience} onChange={changeAudience} labels={labels} size="md" />
                        </div>

                        {/* search */}
                        <form
                            onSubmit={handleSearchSubmit}
                            role="search"
                            className="mb-6 flex min-h-12 items-center gap-3 rounded-2xl border border-gold/30 bg-black/4 px-4 focus-within:border-gold"
                        >
                            <Search size={19} className="shrink-0 text-gold-deep" aria-hidden="true" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={labels.searchPlaceholderMobile}
                                aria-label={labels.searchLabel}
                                className="w-full bg-transparent py-3 text-sm text-black outline-none placeholder:text-black/45"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label={labels.clearSearch}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-black/55 hover:bg-black/5 hover:text-black"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        {/* links + accordions */}
                        <ul className="flex flex-col border-t border-black/10">
                            {links.map((link, i) => {
                                const mega = link.mega;
                                const isOpen = openAccordion === i;
                                return (
                                    <li key={link.label} className="border-b border-black/10">
                                        {mega ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenAccordion(isOpen ? null : i)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`m-acc-${i}`}
                                                    className="flex min-h-14 w-full items-center justify-between gap-4 text-base font-bold text-black transition-colors hover:text-gold-deep focus:outline-none focus-visible:text-gold-deep"
                                                >
                                                    {link.label}
                                                    <ChevronDown
                                                        size={18}
                                                        className={`text-gold-deep transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                <div
                                                    id={`m-acc-${i}`}
                                                    className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out ${isOpen
                                                        ? "visible grid-rows-[1fr]"
                                                        : "invisible grid-rows-[0fr]"
                                                        }`}
                                                >
                                                    <div className="overflow-hidden">
                                                        <div className="flex flex-col gap-5 pb-5">
                                                            {mega.columns.map((col) => (
                                                                <div key={col.title}>
                                                                    <p className="mb-1 text-xs font-bold text-gold-deep">
                                                                        {col.title}
                                                                    </p>
                                                                    <ul className="flex flex-col">
                                                                        {col.items.map((item) => {
                                                                            const Icon = item.icon;
                                                                            return (
                                                                                <li key={item.href}>
                                                                                    <a
                                                                                        href={item.href}
                                                                                        onClick={(e) =>
                                                                                            handleLinkClick(e, item.href)
                                                                                        }
                                                                                        className="flex min-h-12 items-center gap-3 rounded-lg px-1 text-[15px] text-black/75 transition-colors hover:text-gold-deep"
                                                                                    >
                                                                                        {Icon && (
                                                                                            <Icon
                                                                                                size={18}
                                                                                                strokeWidth={1.6}
                                                                                                className="shrink-0 text-gold-deep"
                                                                                            />
                                                                                        )}
                                                                                        {item.label}
                                                                                    </a>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                            <a
                                                                href={link.href}
                                                                onClick={(e) => handleLinkClick(e, link.href)}
                                                                className="inline-flex w-fit items-center gap-2 text-sm font-bold text-gold-deep"
                                                            >
                                                                {labels.viewAll} {link.label}
                                                                <ArrowLeft size={15} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleLinkClick(e, link.href)}
                                                className="group flex min-h-14 items-center justify-between gap-4 text-base font-bold text-black transition-colors hover:text-gold-deep"
                                            >
                                                <span>{link.label}</span>
                                                <ArrowLeft
                                                    size={17}
                                                    className="shrink-0 text-gold-deep transition-transform group-hover:-translate-x-1"
                                                />
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* quick tools */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {[
                                { href: favoritesHref, label: labels.favorites, icon: <Heart size={21} strokeWidth={1.7} /> },
                                {
                                    href: cartHref,
                                    label: labels.cart,
                                    icon: (
                                        <span className="relative">
                                            <ShoppingBag size={21} strokeWidth={1.7} />
                                            {safeItemCount > 0 && (
                                                <span
                                                    className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-black"
                                                    style={{ backgroundImage: goldFill }}
                                                >
                                                    {safeItemCount > 99 ? "99+" : safeItemCount}
                                                </span>
                                            )}
                                        </span>
                                    ),
                                },
                                {
                                    href: isAuthenticated ? profileHref : loginHref,
                                    label: isAuthenticated ? labels.account : labels.login,
                                    icon: <User size={21} strokeWidth={1.7} />,
                                },
                            ].map((t) => (
                                <a
                                    key={t.label}
                                    href={t.href}
                                    onClick={(e) => handleLinkClick(e, t.href)}
                                    className="flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl border border-gold/25 bg-black/3 p-3 text-sm font-semibold text-black transition-colors hover:border-gold/70 hover:bg-black/6"
                                >
                                    <span className="text-gold-deep">{t.icon}</span>
                                    <span>{t.label}</span>
                                </a>
                            ))}
                            {onLanguageToggle && (
                                <button
                                    type="button"
                                    onClick={onLanguageToggle}
                                    className="flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl border border-gold/25 bg-black/3 p-3 text-sm font-semibold text-black transition-colors hover:border-gold/70 hover:bg-black/6"
                                >
                                    <Globe size={21} strokeWidth={1.7} className="text-gold-deep" />
                                    <span>{languageLabel ?? "English"}</span>
                                </button>
                            )}
                        </div>

                        {isAuthenticated && onLogout && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onLogout();
                                }}
                                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-black/20 px-4 py-3 text-sm font-bold text-black/75 transition-colors hover:border-gold hover:text-gold-deep"
                            >
                                <LogOut size={18} strokeWidth={1.8} />
                                <span>{labels.logout}</span>
                            </button>
                        )}

                        {labels.footer && (
                            <div className="mt-6 border-t border-black/10 pt-4 text-center">
                                <p className="text-[10px] font-medium tracking-[0.22em] text-black/45">{labels.footer}</p>
                            </div>
                        )}
                    </div>

                    {/* sticky B2B CTA */}
                    {audience === "b2b" && (
                        <div className="relative shrink-0 border-t border-black/10 p-4">
                            <a
                                href={quoteHref}
                                onClick={(e) => handleLinkClick(e, quoteHref)}
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-black"
                                style={{ backgroundImage: goldFill }}
                            >
                                <FileText size={18} />
                                {labels.quote}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
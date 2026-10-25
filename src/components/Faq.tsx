import Link from "next/link";
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import { goldFill } from "./theme";

/* ------------------------------------------------------------------ */
/* Types + default content                                             */
/* ------------------------------------------------------------------ */

export interface FaqItem {
    question: string;
    /** نص عادي بس (بيتحط كمان في structured data) */
    answer: string;
}
const DEFAULT_FAQS: FaqItem[] = [
    {
        question: "ما العلامات التي تقدّمها المجموعة؟",
        answer:
            "نقدّم علامتين: بارنيز للقهوة المختصة، وسعد الدين للحلويات والتمور وعلب الهدايا. تجد منتجات كل علامة في صفحة خاصة بها.",
    },
    {
        question: "هل أستطيع تخصيص طلبي؟",
        answer:
            "نعم. يمكنك اختيار التغليف والشعار والرسالة المكتوبة وتشكيلة المنتجات. ابدأ من صفحة الطلب المخصص وسنراجع التفاصيل معك قبل التجهيز.",
    },
    {
        question: "هل تخدمون الشركات؟",
        answer:
            "نعم. لدينا التوريد بالجملة، وحلول للفنادق والمقاهي، وهدايا الشركات، وفتح حساب شركة. أرسل احتياجك وسنعود إليك بعرض سعر مفصّل.",
    },
    {
        question: "كيف أجهّز لمناسبة مثل رمضان أو الأفراح؟",
        answer:
            "تصفّح قسم المناسبات واختر ما يناسبك، أو اطلب تشكيلة مخصصة لمناسبتك بالكمية والتغليف الذي تريده.",
    },
    {
        question: "من أين تُجهَّز الطلبات؟",
        answer: "تُجهَّز طلباتنا وتُرسل من الرياض.",
    },
];


/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

interface FaqProps {
    faqs?: FaqItem[];
    /** صفحة التواصل. لو مفيش contactHref ولا whatsappHref كارت المساعدة مش بيظهر */
    contactHref?: string;
    /** رابط واتساب كامل (https://wa.me/...) */
    whatsappHref?: string;
    id?: string;
    className?: string;
}

export default function Faq({
    faqs = DEFAULT_FAQS,
    contactHref,
    whatsappHref,
    id = "faq",
    className = "",
}: FaqProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };
    const showHelp = Boolean(contactHref || whatsappHref);

    return (
        <section
            id={id}
            dir="rtl"
            lang="ar"
            aria-labelledby={`${id}-title`}
            /* below the fold: the browser skips rendering it until it's near the viewport */
            className={`relative scroll-mt-28 bg-white py-16 text-black [contain-intrinsic-size:auto_800px] [content-visibility:auto] sm:py-24 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20">
                    {/* ---------- heading + help card ---------- */}
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <h2 id={`${id}-title`} className="text-3xl font-semibold sm:text-4xl">
                            أسئلة شائعة
                        </h2>
                        <span
                            aria-hidden
                            className="mt-5 block h-px w-24"
                            style={{ backgroundImage: "linear-gradient(90deg,transparent,#d4af37,transparent)" }}
                        />
                        <p className="mt-6 max-w-sm text-base leading-loose text-black/65">
                            إجابات سريعة عن أكثر ما يسألنا عنه عملاؤنا.
                        </p>

                        {showHelp && (
                            <div className="mt-8 rounded-3xl border border-gold/40 bg-black p-6 text-white">
                                <p className="text-lg font-semibold">لم تجد إجابتك؟</p>
                                <p className="mt-2 text-sm leading-loose text-white/70">
                                    اكتب لنا وسنساعدك في اختيار الأنسب.
                                </p>
                                <div className="mt-5 flex flex-col gap-3">
                                    {contactHref && (
                                        <Link
                                            href={contactHref}
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                            style={{ backgroundImage: goldFill }}
                                        >
                                            تواصل معنا
                                            <ArrowLeft size={16} aria-hidden />
                                        </Link>
                                    )}
                                    {whatsappHref && (
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/60 px-6 text-sm font-bold text-white transition-colors duration-300 hover:border-transparent hover:bg-[linear-gradient(135deg,#f5e3a1,#d4af37_55%,#b8891f)] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                        >
                                            <MessageCircle size={16} aria-hidden />
                                            واتساب
                                            <span className="sr-only">(يفتح في نافذة جديدة)</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ---------- accordion: native <details>, no JS ---------- */}
                    <ul className="border-t border-black/10">
                        {faqs.map((f) => (
                            <li key={f.question} className="border-b border-black/10">
                                <details name={`${id}-group`} className="group">
                                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-base font-semibold transition-colors duration-300 hover:text-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-gold group-open:text-gold-deep sm:text-lg [&::-webkit-details-marker]:hidden">
                                        <span>{f.question}</span>
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold-deep transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none">
                                            <Plus size={18} aria-hidden />
                                        </span>
                                    </summary>
                                    <p className="max-w-2xl pb-6 text-base leading-loose text-black/65">{f.answer}</p>
                                </details>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
        </section>
    );
}

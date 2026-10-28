import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LegalDoc } from "./legal-content";

const brandLine = "linear-gradient(90deg,#005430,transparent)";

function Bullet({ text, boldLead }: { text: string; boldLead?: boolean }) {
    const i = boldLead ? text.indexOf(":") : -1;
    return (
        <li className="flex gap-3">
            <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <span>
                {i > 0 ? (
                    <>
                        <strong className="font-semibold text-black">{text.slice(0, i + 1)}</strong>
                        {text.slice(i + 1)}
                    </>
                ) : (
                    text
                )}
            </span>
        </li>
    );
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
    const indexed = doc.sections.map((section, i) => ({ section, id: `section-${i + 1}` }));
    const toc = indexed.filter(({ section }) => section.heading && (section.level ?? 2) === 2);
    const showToc = toc.length >= 3;

    return (
        <main dir="rtl" lang="ar" className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 max-w-3xl sm:mb-14">
                    <h1 className="text-3xl font-semibold text-black sm:text-4xl">{doc.title}</h1>
                    <span aria-hidden className="mt-5 block h-px w-40" style={{ backgroundImage: brandLine }} />
                </header>

                <div className={showToc ? "grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14" : ""}>
                    {showToc && (
                        <nav
                            aria-label="محتويات الصفحة"
                            className="h-fit rounded-2xl border border-brand/30 p-5 lg:sticky lg:top-32"
                        >
                            <p className="mb-3 text-sm font-semibold text-brand-deep">محتويات الصفحة</p>
                            <ul className="flex flex-col">
                                {toc.map(({ section, id }) => (
                                    <li key={id}>
                                        <a
                                            href={`#${id}`}
                                            className="inline-flex min-h-9 items-center text-sm leading-snug text-black/70 transition-colors hover:text-brand-deep focus:outline-none focus-visible:text-brand-deep focus-visible:underline"
                                        >
                                            {section.heading}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    <div className="max-w-3xl">
                        {indexed.map(({ section, id }) => {
                            const isSub = section.level === 3;
                            return (
                                <section key={id} id={id} className="scroll-mt-32 not-first:mt-10">
                                    {section.heading &&
                                        (isSub ? (
                                            <h3 className="mb-3 text-lg font-semibold text-brand-deep">{section.heading}</h3>
                                        ) : (
                                            <h2 className="mb-3 text-xl font-semibold text-black sm:text-2xl">
                                                {section.heading}
                                            </h2>
                                        ))}

                                    {section.paragraphs?.map((p, i) => (
                                        <p key={i} className="mt-4 text-[15px] leading-loose text-black/75 first:mt-0 sm:text-base sm:leading-loose">
                                            {p}
                                        </p>
                                    ))}

                                    {section.bullets && (
                                        <ul className="flex flex-col gap-3 text-[15px] leading-loose text-black/75 sm:text-base sm:leading-loose">
                                            {section.bullets.map((b, i) => (
                                                <Bullet key={i} text={b} boldLead={section.boldLead} />
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            );
                        })}

                        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand/30 p-6 sm:flex-row sm:items-center">
                            <p className="text-sm leading-loose text-black/70 sm:text-base">
                                عندك استفسار عن هذه الصفحة؟ فريقنا جاهز للمساعدة.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-brand-soft transition-colors duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand hover:bg-brand-deep"
                            >
                                تواصل معنا
                                <ArrowLeft size={16} aria-hidden />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

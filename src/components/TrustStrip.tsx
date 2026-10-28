import { Gift, LockKeyhole, ShieldCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrustItem {
    title: string;
    text: string;
    icon: LucideIcon;
}

const DEFAULT_ITEMS: TrustItem[] = [
    { title: "جودة مضمونة", text: "منتجات طازجة ومختارة بعناية", icon: ShieldCheck },
    { title: "توصيل سريع", text: "لجميع مدن المملكة", icon: Truck },
    { title: "دفع آمن", text: "مدفوعات محمية بالكامل", icon: LockKeyhole },
    { title: "تغليف فاخر", text: "جاهز للإهداء في كل مناسبة", icon: Gift },
];

export default function TrustStrip({ items = DEFAULT_ITEMS, className = "" }: { items?: TrustItem[]; className?: string }) {
    return (
        <section dir="rtl" lang="ar" aria-label="لماذا تتسوق معنا" className={`border-b border-brand/10 bg-cream ${className}`}>
            <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:px-8 lg:py-8">
                {items.map(({ title, text, icon: Icon }) => (
                    <li key={title} className="flex items-center gap-3 sm:gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white sm:h-12 sm:w-12">
                            <Icon size={20} strokeWidth={1.7} aria-hidden />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-bold text-brand-deep sm:text-base">{title}</span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-black/60 sm:text-sm">{text}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

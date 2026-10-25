import type { Metadata } from "next";
import BrandProducts from "@/components/BrandProducts";
import { BRANDS } from "@/components/brands";
import type { BrandId } from "@/components/brands";
import { goldLine } from "@/components/theme";

export const metadata: Metadata = {
    title: "كل المنتجات | RNQ",
    description: `${BRANDS.barns.title} و${BRANDS.saadeddin.title} في مكان واحد.`,
};

const BRAND_ORDER: BrandId[] = ["barns", "saadeddin"];

export default function ProductsPage() {
    return (
        <main dir="rtl" lang="ar">
            <header className="bg-white px-4 pt-14 text-center sm:pt-20">
                <h1 className="text-3xl font-semibold text-black sm:text-4xl">كل المنتجات</h1>
                <p className="mx-auto mt-3 max-w-xl text-base leading-loose text-black/65">
                    قهوة مختصة وحلويات فاخرة، تصلك من الرياض بجودة تليق بضيافتك.
                </p>
                <span aria-hidden className="mx-auto mt-5 block h-px w-40" style={{ backgroundImage: goldLine }} />
            </header>
            {BRAND_ORDER.map((b) => (
                <BrandProducts key={b} brand={b} />
            ))}
        </main>
    );
}

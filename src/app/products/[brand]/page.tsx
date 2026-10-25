import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandProducts from "@/components/BrandProducts";
import { BRANDS, isBrandId } from "@/components/brands";
import type { BrandId } from "@/components/brands";

/* صفحة لكل براند (barns, saadeddin)، وأي رابط تاني بيرجع 404 */
export const dynamicParams = false;

export function generateStaticParams() {
    return (Object.keys(BRANDS) as BrandId[]).map((brand) => ({ brand }));
}

type Params = Promise<{ brand: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { brand } = await params;
    if (!isBrandId(brand)) return {};
    return {
        title: `${BRANDS[brand].title} | RNQ`,
        description: BRANDS[brand].blurb,
    };
}

export default async function BrandPage({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: Promise<{ type?: string }>;
}) {
    const { brand } = await params;
    if (!isBrandId(brand)) notFound();
    const { type } = await searchParams;
    const valid = BRANDS[brand].categories.some((c) => c.id === type);

    return (
        <main>
            <BrandProducts key={valid ? type : "all"} brand={brand} headingAs="h1" initialCategory={valid ? type : undefined} />
        </main>
    );
}

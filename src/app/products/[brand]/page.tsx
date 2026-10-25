import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandProducts from "@/components/BrandProducts";
import BrandProductsFromUrl from "@/components/BrandProductsFromUrl";
import { BRANDS, isBrandId } from "@/components/brands";
import type { BrandId } from "@/components/brands";

export const dynamicParams = false;

export function generateStaticParams() {
    return (Object.keys(BRANDS) as BrandId[]).map((brand) => ({ brand }));
}

type Params = Promise<{ brand: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { brand } = await params;
    if (!isBrandId(brand)) return {};
    const b = BRANDS[brand];
    return {
        title: b.title,
        description: b.blurb,
        alternates: { canonical: `/products/${brand}` },
        openGraph: { title: b.title, description: b.blurb, url: `/products/${brand}` },
    };
}

export default async function BrandPage({ params }: { params: Params }) {
    const { brand } = await params;
    if (!isBrandId(brand)) notFound();

    return (
        <main>
            <Suspense fallback={<BrandProducts brand={brand} headingAs="h1" />}>
                <BrandProductsFromUrl brand={brand} />
            </Suspense>
        </main>
    );
}

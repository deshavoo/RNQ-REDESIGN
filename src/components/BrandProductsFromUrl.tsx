"use client";

import { useSearchParams } from "next/navigation";
import BrandProducts from "./BrandProducts";
import { BRANDS } from "./brands";
import type { BrandId } from "./brands";

export default function BrandProductsFromUrl({ brand }: { brand: BrandId }) {
    const type = useSearchParams().get("type") ?? undefined;
    const valid = BRANDS[brand].categories.some((c) => c.id === type);

    return <BrandProducts key={valid ? type : "all"} brand={brand} headingAs="h1" initialCategory={valid ? type : undefined} />;
}

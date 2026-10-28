"use client";

import { formatPrice, priceOf } from "@/components/brands";
import type { Product } from "@/components/brands";
import { useRegion } from "./region-store";

export default function Price({ product, qty = 1 }: { product: Pick<Product, "price" | "priceEg">; qty?: number }) {
    const region = useRegion();
    return <>{formatPrice(priceOf(product, region) * qty, region)}</>;
}

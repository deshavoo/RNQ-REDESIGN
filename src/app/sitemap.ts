import type { MetadataRoute } from "next";
import { BRANDS, SAMPLE_PRODUCTS, productPath } from "@/components/brands";
import type { BrandId } from "@/components/brands";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const brands = Object.keys(BRANDS) as BrandId[];

    return [
        { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
        { url: absoluteUrl("/products"), changeFrequency: "weekly", priority: 0.9 },
        ...brands.map((b) => ({ url: absoluteUrl(`/products/${b}`), changeFrequency: "weekly" as const, priority: 0.8 })),
        ...brands.flatMap((b) =>
            SAMPLE_PRODUCTS[b].map((p) => ({
                url: absoluteUrl(productPath(b, p)),
                changeFrequency: "weekly" as const,
                priority: 0.7,
                images: p.image ? [absoluteUrl(p.image)] : undefined,
            }))
        ),
        ...["privacy", "terms", "returns", "shipping"].map((p) => ({
            url: absoluteUrl(`/legal/${p}`),
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];
}

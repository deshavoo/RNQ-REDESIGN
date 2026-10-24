import type { Metadata } from "next";
import BrandProducts from "@/components/BrandProducts";
import { BRANDS } from "@/components/brands";

export const metadata: Metadata = {
  title: `${BRANDS.barns.title} | RNQ`,
  description: BRANDS.barns.blurb,
};

export default async function BarnsProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const valid = BRANDS.barns.categories.some((c) => c.id === type);

  return (
    <main>
      <BrandProducts key={valid ? type : "all"} brand="barns" headingAs="h1" initialCategory={valid ? type : undefined} />
    </main>
  );
}

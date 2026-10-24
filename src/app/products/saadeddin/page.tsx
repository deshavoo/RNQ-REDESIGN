import type { Metadata } from "next";
import BrandProducts from "@/components/BrandProducts";
import { BRANDS } from "@/components/brands";

export const metadata: Metadata = {
  title: `${BRANDS.saadeddin.title} | RNQ`,
  description: BRANDS.saadeddin.blurb,
};

export default async function SaadeddinProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const valid = BRANDS.saadeddin.categories.some((c) => c.id === type);

  return (
    <main>
      <BrandProducts key={valid ? type : "all"} brand="saadeddin" headingAs="h1" initialCategory={valid ? type : undefined} />
    </main>
  );
}

import type { Metadata } from "next";
import About from "@/components/About";
import BestSellers from "@/components/BestSellers";
import CustomOrders from "@/components/CustomOrders";
import Faq from "@/components/Faq";
import Occasions from "@/components/Occasions";
import RnqHero from "@/components/RnqHero";
import { BRANDS } from "@/components/brands";
import { HAS_SITE_URL, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/rnq-logo.png"),
    description: SITE_DESCRIPTION,
    brand: Object.values(BRANDS).map((b) => ({ "@type": "Brand", name: b.title })),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: "ar",
  },
];

export default function Home() {
  return (
    <main>
      <RnqHero />
      <BestSellers />
      <Occasions />
      <CustomOrders />
      <About />
      <Faq />
      {HAS_SITE_URL && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
    </main>
  );
}

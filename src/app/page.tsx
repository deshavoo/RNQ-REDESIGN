import type { Metadata } from "next";
import About from "@/components/About";
import BestSellers from "@/components/BestSellers";
import CollectionBanners from "@/components/CollectionBanners";
import CorporateBanner from "@/components/CorporateBanner";
import CustomOrders from "@/components/CustomOrders";
import Faq from "@/components/Faq";
import FeaturedCollections from "@/components/FeaturedCollections";
import GiftFinder from "@/components/GiftFinder";
import Occasions from "@/components/Occasions";
import Reviews from "@/components/Reviews";
import RnqHero from "@/components/RnqHero";
import TrustStrip from "@/components/TrustStrip";
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
      <TrustStrip />
      <CollectionBanners />
      <Occasions />
      <GiftFinder />
      <BestSellers />
      <CorporateBanner />
      <FeaturedCollections />
      <CustomOrders />
      <Reviews />
      <About />
      <Faq />
      {HAS_SITE_URL && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
    </main>
  );
}

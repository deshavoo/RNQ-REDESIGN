import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SHIPPING } from "@/components/legal-content";

export const metadata: Metadata = {
  title: `${SHIPPING.title} | RNQ`,
  description: SHIPPING.description,
};

export default function ShippingPage() {
  return <LegalPage doc={SHIPPING} />;
}

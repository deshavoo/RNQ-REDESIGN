import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { TERMS } from "@/components/legal-content";

export const metadata: Metadata = {
  title: TERMS.title,
  alternates: { canonical: "/legal/terms" },
  description: TERMS.description,
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}

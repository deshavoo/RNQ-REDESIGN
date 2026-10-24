import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PRIVACY } from "@/components/legal-content";

export const metadata: Metadata = {
  title: `${PRIVACY.title} | RNQ`,
  description: PRIVACY.description,
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}

import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { RETURNS } from "@/components/legal-content";

export const metadata: Metadata = {
  title: `${RETURNS.title} | RNQ`,
  description: RETURNS.description,
};

export default function ReturnsPage() {
  return <LegalPage doc={RETURNS} />;
}

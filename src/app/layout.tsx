import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const kufi = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | قهوة بارنيز وحلويات سعد الدين`,
    template: "%s | RNQ",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: "/rnq-logo.png", apple: "/rnq-logo.png" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: SITE_NAME,
    images: [{ url: "/images/rnq-banner.jpg", alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${kufi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SessionProvider refetchOnWindowFocus={false}>
          <div dir="ltr">
            <AnnouncementMarquee />
          </div>
          <SiteNavbar />
          {children}
          <Footer />
          {modal}
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import SiteNavbar from "@/components/SiteNavbar";
import "./globals.css";

const kufi = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  /* بيكمّل روابط صور og:image؛ حط NEXT_PUBLIC_SITE_URL في .env لما الدومين يبقى جاهز */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "مجموعة RNQ للتجارة | قهوة بارنيز وحلويات سعد الدين",
  description: "قهوة مختصة وحلويات فاخرة، تصلك من الرياض بجودة تليق بضيافتك.",
  icons: { icon: "/MyLogo.png" },
};

/** modal: نافذة المعاينة السريعة للمنتج (app/@modal)، بتظهر فوق أي صفحة اتضغط منها على منتج */
export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${kufi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SessionProvider>
          {/* dir="ltr" عشان اتجاه حركة الشريط يفضل زي ما هو دلوقتي */}
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

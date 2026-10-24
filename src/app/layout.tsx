import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

const kufi = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مجموعة RNQ للتجارة | قهوة بارنيز وحلويات سعد الدين",
  description: "قهوة مختصة وحلويات فاخرة، تصلك من الرياض بجودة تليق بضيافتك.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${kufi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* dir="ltr" عشان اتجاه حركة الشريط يفضل زي ما هو دلوقتي */}
        <div dir="ltr">
          <AnnouncementMarquee />
        </div>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

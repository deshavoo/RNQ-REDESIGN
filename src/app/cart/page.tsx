import type { Metadata } from "next";
import CartClient from "./cart-client";

export const metadata: Metadata = {
    title: "سلة التسوق",
    robots: { index: false, follow: true },
};

export default function CartPage() {
    return <CartClient />;
}

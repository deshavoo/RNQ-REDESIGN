import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { toClientAddress } from "@/lib/profile";
import CheckoutClient from "./checkout-client";

export const metadata: Metadata = {
    title: "إتمام الطلب",
    robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth?callbackUrl=/checkout");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, phone: true, addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] } },
    });
    if (!user) redirect("/auth");

    return <CheckoutClient name={user.name} phone={user.phone ?? ""} addresses={user.addresses.map(toClientAddress)} />;
}

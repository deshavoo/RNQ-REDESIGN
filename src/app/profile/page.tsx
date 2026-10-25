import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BRANDS, findProduct, isBrandId, productPath } from "@/components/brands";
import { BUSINESS_TYPES } from "@/lib/validation";
import { tierFor, toClientAddress } from "@/lib/profile";
import type { ClientOrder, ClientWishItem, ProfileUser } from "@/lib/profile";
import ProfileClient from "./profile-client";
import type { TabId } from "./profile-client";

export const metadata: Metadata = {
    title: "حسابي",
    description: "إدارة تفاصيل الحساب والطلبات السابقة والعناوين وقائمة المفضلة في مجموعة RNQ للتجارة.",
    robots: { index: false, follow: false },
};

const TAB_IDS: TabId[] = ["orders", "addresses", "account", "wishlist"];

const dateAr = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString("ar-SA", { calendar: "gregory", ...opts });

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth?callbackUrl=/profile");

    const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            company: true,
            orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
            addresses: { orderBy: { createdAt: "asc" } },
            wishlist: { orderBy: { createdAt: "desc" } },
        },
    });
    if (!dbUser) redirect("/auth");

    const { tab } = await searchParams;
    const c = dbUser.company;

    const user: ProfileUser = {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone ?? "",
        birthday: dbUser.birthday ? dbUser.birthday.toISOString().slice(0, 10) : "",
        joined: dateAr(dbUser.createdAt, { month: "long", year: "numeric" }),
        points: dbUser.points,
        ...tierFor(dbUser.points),
        company: c && {
            name: c.name,
            crNumber: c.crNumber,
            vatNumber: c.vatNumber,
            businessType: BUSINESS_TYPES.find((t) => t.id === c.businessType)?.label ?? c.businessType,
            city: c.city,
            status: c.status,
        },
    };

    const orders: ClientOrder[] = dbUser.orders.map((o) => ({
        id: o.id,
        date: dateAr(o.createdAt, { day: "numeric", month: "long", year: "numeric" }),
        total: o.total.toNumber(),
        status: o.status,
        items: o.items.map((i) => ({ brand: i.brand, productId: i.productId, name: i.name, qty: i.qty, price: i.price.toNumber() })),
    }));

    const wishlist: ClientWishItem[] = dbUser.wishlist.flatMap((w) => {
        if (!isBrandId(w.brand)) return [];
        const p = findProduct(w.brand, w.productId);
        if (!p) return [];
        return [{
            brand: w.brand,
            productId: w.productId,
            name: p.name,
            note: p.description ?? BRANDS[w.brand].title,
            price: p.price,
            image: p.image,
            href: productPath(w.brand, p),
        }];
    });

    return (
        <ProfileClient
            initialTab={TAB_IDS.find((t) => t === tab) ?? "orders"}
            initialUser={user}
            initialOrders={orders}
            initialAddresses={dbUser.addresses.map(toClientAddress)}
            initialWishlist={wishlist}
        />
    );
}

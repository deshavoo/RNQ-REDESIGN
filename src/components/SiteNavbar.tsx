"use client";

import { signOut, useSession } from "next-auth/react";
import { useCart } from "./cart/cart-store";
import Navbar from "./Navbar";

export default function SiteNavbar() {
    const { data, status } = useSession();
    const { count } = useCart();

    return (
        <Navbar
            user={data?.user ? { name: data.user.name } : null}
            isAuthLoading={status === "loading"}
            cartCount={count}
            favoritesHref="/profile?tab=wishlist"
            onLogout={() => signOut({ redirectTo: "/" })}
        />
    );
}

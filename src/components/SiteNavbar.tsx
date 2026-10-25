"use client";

import { signOut, useSession } from "next-auth/react";
import Navbar from "./Navbar";

/**
 * النافبار مربوط بالجلسة من الكلاينت (مش auth() في الـ layout)
 * عشان صفحات المنتجات تفضل static ومتتحولش كلها لـ dynamic.
 */
export default function SiteNavbar() {
    const { data, status } = useSession();

    return (
        <Navbar
            user={data?.user ? { name: data.user.name } : null}
            isAuthLoading={status === "loading"}
            favoritesHref="/profile?tab=wishlist"
            onLogout={() => signOut({ redirectTo: "/" })}
        />
    );
}

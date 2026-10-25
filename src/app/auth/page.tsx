import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthClient from "./auth-client";
import type { AuthView } from "./auth-client";

export const metadata: Metadata = {
    title: "تسجيل الدخول",
    robots: { index: false, follow: true },
    description: "سجّل دخولك أو افتح حساب جديد للأفراد أو للشركات في مجموعة RNQ للتجارة.",
};

const safePath = (v?: string) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/profile");

export default async function AuthPage({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string; type?: string; callbackUrl?: string }>;
}) {
    const { mode, type, callbackUrl } = await searchParams;
    const next = safePath(callbackUrl);

    if ((await auth())?.user) redirect(next);

    const view: AuthView = mode === "register" ? (type === "business" ? "business" : "individual") : "login";
    return <AuthClient initialView={view} callbackUrl={next} />;
}

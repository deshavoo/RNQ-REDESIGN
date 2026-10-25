import { redirect } from "next/navigation";

/* رابط "فتح حساب شركة" في النافبار بيفتح فورم الشركات في صفحة الدخول */
export default function BusinessRegisterPage() {
    redirect("/auth?mode=register&type=business");
}

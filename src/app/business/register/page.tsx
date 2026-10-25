import { redirect } from "next/navigation";

export default function BusinessRegisterPage() {
    redirect("/auth?mode=register&type=business");
}

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

const DUMMY_HASH = "$2b$12$Sp66TsrL2uNOOr6/x1lIK.BvRviQ1KIcYkhbZ2wFkLLzRDbx1BAL6";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    pages: { signIn: "/auth" },
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            async authorize(raw) {
                const parsed = loginSchema.safeParse(raw);
                if (!parsed.success) return null;

                const user = await db.user.findUnique({ where: { email: parsed.data.email } });
                const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
                if (!user || !ok) return null;

                return { id: user.id, name: user.name, email: user.email, accountType: user.accountType };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.accountType = user.accountType;
            }
            if (trigger === "update" && typeof session?.name === "string") token.name = session.name;
            return token;
        },
        session({ session, token }) {
            if (token.id) session.user.id = token.id;
            if (token.accountType) session.user.accountType = token.accountType;
            return session;
        },
    },
});

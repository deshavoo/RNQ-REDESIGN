import type { DefaultSession } from "next-auth";
import type { AccountType } from "@/generated/prisma/enums";

declare module "next-auth" {
    interface User {
        accountType?: AccountType;
    }
    interface Session {
        user: { id: string; accountType: AccountType } & DefaultSession["user"];
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id?: string;
        accountType?: AccountType;
    }
}

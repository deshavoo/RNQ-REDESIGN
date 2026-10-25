import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function client() {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    const instance = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    globalForPrisma.prisma = instance;
    return instance;
}

export const db = new Proxy({} as PrismaClient, {
    get(_, prop) {
        const c = client();
        const value = Reflect.get(c, prop);
        return typeof value === "function" ? value.bind(c) : value;
    },
});

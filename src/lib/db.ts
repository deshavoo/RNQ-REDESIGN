import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/* نسخة واحدة بس من الـ client، حتى مع الـ hot reload وقت التطوير */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL مش متعرّف في ملف .env");
    return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: { path: "prisma/migrations" },
    /*
     * الـ migrations على الاتصال المباشر (DIRECT_URL) لأن الـ pooler مش مناسب ليها،
     * والموقع نفسه بيستخدم DATABASE_URL في src/lib/db.ts.
     * مش env() عشان prisma generate يشتغل من غير قاعدة بيانات (مثلاً وقت npm install).
     */
    datasource: { url: process.env.DIRECT_URL || process.env.DATABASE_URL },
});

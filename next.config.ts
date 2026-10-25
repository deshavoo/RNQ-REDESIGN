import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    /* فيه package-lock.json تاني في فولدر المستخدم، فبنحدد جذر المشروع صراحة */
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

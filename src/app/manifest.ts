import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_NAME,
        short_name: "RNQ",
        description: SITE_DESCRIPTION,
        lang: "ar",
        dir: "rtl",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#005430",
        icons: [{ src: "/rnq-icon.png", sizes: "512x512", type: "image/png" }],
    };
}

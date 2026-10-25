export const SITE_NAME = "مجموعة RNQ للتجارة";

export const SITE_DESCRIPTION = "قهوة مختصة وحلويات فاخرة، تصلك من الرياض بجودة تليق بضيافتك.";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const HAS_SITE_URL = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

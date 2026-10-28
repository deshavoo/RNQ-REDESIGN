export type RegionId = "SA" | "EG";

export type ShippingMethodId = "courier" | "express";

export interface ShippingMethod {
    id: ShippingMethodId;
    label: string;
    eta: string;
    fee: number;
}

export interface Region {
    id: RegionId;
    name: string;
    currency: "SAR" | "EGP";
    currencyLabel: string;
    dialCode: string;
    phoneExample: string;
    freeShippingFrom: number;
    shipping: readonly ShippingMethod[];
}

export const REGIONS: Record<RegionId, Region> = {
    SA: {
        id: "SA",
        name: "السعودية",
        currency: "SAR",
        currencyLabel: "ر.س",
        dialCode: "+966",
        phoneExample: "05XXXXXXXX",
        freeShippingFrom: 300,
        shipping: [
            { id: "courier", label: "مندوب التوصيل", eta: "من يوم إلى 3 أيام", fee: 25 },
            { id: "express", label: "أمانة إكسبريس", eta: "من 3 إلى 7 أيام", fee: 35 },
        ],
    },
    EG: {
        id: "EG",
        name: "مصر",
        currency: "EGP",
        currencyLabel: "ج.م",
        dialCode: "+20",
        phoneExample: "01XXXXXXXXX",
        freeShippingFrom: 3000,
        shipping: [
            { id: "courier", label: "مندوب التوصيل", eta: "من يومين إلى 4 أيام", fee: 75 },
            { id: "express", label: "توصيل سريع", eta: "خلال 24 ساعة في القاهرة والجيزة", fee: 120 },
        ],
    },
};

export const REGION_IDS = Object.keys(REGIONS) as RegionId[];

export const DEFAULT_REGION: RegionId = "SA";

export const isRegionId = (v: unknown): v is RegionId => typeof v === "string" && Object.prototype.hasOwnProperty.call(REGIONS, v);

export const SHIPPING_METHOD_IDS: [ShippingMethodId, ...ShippingMethodId[]] = ["courier", "express"];

const PHONE_RULES: Record<RegionId, { pattern: RegExp; prefix: RegExp; dial: string }> = {
    SA: { pattern: /^(?:\+?966|0)5\d{8}$/, prefix: /^(?:\+?966|0)/, dial: "+966" },
    EG: { pattern: /^(?:\+?20|0)1[0125]\d{8}$/, prefix: /^(?:\+?20|0)/, dial: "+20" },
};

export function normalizePhone(raw: string, region: RegionId): string | null {
    const v = raw.replace(/[\s-]/g, "");
    const rule = PHONE_RULES[region];
    return rule.pattern.test(v) ? `${rule.dial}${v.replace(rule.prefix, "")}` : null;
}

export function phoneRegion(phone: string): RegionId | null {
    return REGION_IDS.find((r) => normalizePhone(phone, r) !== null) ?? null;
}

export function shippingFee(region: RegionId, method: ShippingMethodId, subtotal: number) {
    const r = REGIONS[region];
    if (subtotal >= r.freeShippingFrom) return 0;
    return r.shipping.find((m) => m.id === method)?.fee ?? 0;
}

export const formatMoney = (n: number, region: RegionId = DEFAULT_REGION) =>
    `${n.toLocaleString("en-US")} ${REGIONS[region].currencyLabel}`;

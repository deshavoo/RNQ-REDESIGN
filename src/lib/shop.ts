export const SHIPPING_METHODS = [
    { id: "courier", label: "مندوب التوصيل", eta: "من يوم إلى 3 أيام", fee: 25 },
    { id: "express", label: "أمانة إكسبريس", eta: "من 3 إلى 7 أيام", fee: 35 },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export const FREE_SHIPPING_FROM = 300;

export const MAX_QTY = 20;

export function shippingFee(method: ShippingMethodId, subtotal: number) {
    if (subtotal >= FREE_SHIPPING_FROM) return 0;
    return SHIPPING_METHODS.find((m) => m.id === method)?.fee ?? 0;
}

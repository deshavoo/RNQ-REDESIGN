import type { Address } from "@/generated/prisma/client";
import type { AddressKind, CompanyStatus, OrderStatus } from "@/generated/prisma/enums";

export interface ClientAddress {
    id: string;
    label: string;
    kind: AddressKind;
    city: string;
    street: string;
    phone: string;
    isDefault: boolean;
}

export interface ClientOrder {
    id: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: { brand: string; productId: string; name: string; qty: number; price: number }[];
}

export interface ClientWishItem {
    brand: string;
    productId: string;
    name: string;
    note: string;
    price: number;
    image?: string;
    href: string;
}

export interface ClientCompany {
    name: string;
    crNumber: string;
    vatNumber: string | null;
    businessType: string;
    city: string;
    status: CompanyStatus;
}

export interface ProfileUser {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    joined: string;
    points: number;
    tier: string;
    nextTier: string | null;
    nextTierPoints: number;
    company: ClientCompany | null;
}

export const toClientAddress = (a: Address): ClientAddress => ({
    id: a.id,
    label: a.label,
    kind: a.kind,
    city: a.city,
    street: a.street,
    phone: a.phone,
    isDefault: a.isDefault,
});

const TIERS = [
    { name: "العضوية البرونزية", from: 0 },
    { name: "العضوية الفضية", from: 500 },
    { name: "العضوية الذهبية", from: 1500 },
    { name: "العضوية الماسية", from: 3000 },
    { name: "العضوية الملكية", from: 5000 },
];

export function tierFor(points: number) {
    const i = TIERS.findLastIndex((t) => points >= t.from);
    const next = TIERS[i + 1];
    return { tier: TIERS[i].name, nextTier: next?.name ?? null, nextTierPoints: next?.from ?? TIERS[i].from };
}

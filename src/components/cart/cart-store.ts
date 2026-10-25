"use client";

import { useMemo, useSyncExternalStore } from "react";
import { findProduct, isBrandId } from "@/components/brands";
import type { BrandId, Product } from "@/components/brands";
import { MAX_QTY } from "@/lib/shop";

export interface CartItem {
    brand: BrandId;
    productId: string;
    qty: number;
}

export interface CartLine extends CartItem {
    product: Product;
    total: number;
}

const KEY = "rnq-cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let items: CartItem[] | null = null;

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n) || 1));

function read(): CartItem[] {
    try {
        const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
        if (!Array.isArray(raw)) return [];
        return raw.filter(
            (i): i is CartItem =>
                typeof i?.brand === "string" && isBrandId(i.brand) && typeof i.productId === "string" && findProduct(i.brand, i.productId) !== undefined
        ).map((i) => ({ ...i, qty: clampQty(i.qty) }));
    } catch {
        return [];
    }
}

function snapshot() {
    items ??= read();
    return items;
}

function commit(next: CartItem[]) {
    items = next;
    try {
        localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
        if (e.key !== KEY) return;
        items = read();
        listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

export const cart = {
    add(brand: BrandId, productId: string, qty = 1) {
        const list = snapshot();
        const existing = list.find((i) => i.brand === brand && i.productId === productId);
        commit(
            existing
                ? list.map((i) => (i === existing ? { ...i, qty: clampQty(i.qty + qty) } : i))
                : [...list, { brand, productId, qty: clampQty(qty) }]
        );
    },
    setQty(brand: BrandId, productId: string, qty: number) {
        commit(snapshot().map((i) => (i.brand === brand && i.productId === productId ? { ...i, qty: clampQty(qty) } : i)));
    },
    remove(brand: BrandId, productId: string) {
        commit(snapshot().filter((i) => !(i.brand === brand && i.productId === productId)));
    },
    clear() {
        commit([]);
    },
};

export function useCartItems() {
    return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export function useCart() {
    const list = useCartItems();
    return useMemo(() => {
        const lines: CartLine[] = list.flatMap((i) => {
            const product = findProduct(i.brand, i.productId);
            return product ? [{ ...i, product, total: product.price * i.qty }] : [];
        });
        return {
            lines,
            count: lines.reduce((n, l) => n + l.qty, 0),
            subtotal: lines.reduce((n, l) => n + l.total, 0),
        };
    }, [list]);
}

const noop = () => () => {};

export function useHydrated() {
    return useSyncExternalStore(noop, () => true, () => false);
}

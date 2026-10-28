"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_REGION, isRegionId } from "@/lib/regions";
import type { RegionId } from "@/lib/regions";

const KEY = "rnq-region";
const listeners = new Set<() => void>();
let current: RegionId | null = null;

function read(): RegionId {
    try {
        const v = localStorage.getItem(KEY);
        return isRegionId(v) ? v : DEFAULT_REGION;
    } catch {
        return DEFAULT_REGION;
    }
}

function snapshot() {
    current ??= read();
    return current;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
        if (e.key !== KEY) return;
        current = read();
        listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

export function setRegion(next: RegionId) {
    current = next;
    try {
        localStorage.setItem(KEY, next);
    } catch {}
    listeners.forEach((l) => l());
}

export function useRegion() {
    return useSyncExternalStore(subscribe, snapshot, () => DEFAULT_REGION);
}

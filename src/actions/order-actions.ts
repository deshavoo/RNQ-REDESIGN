"use server";

import { auth } from "@/auth";
import { findProduct, isBrandId } from "@/components/brands";
import { db } from "@/lib/db";
import { SHIPPING_METHODS, shippingFee } from "@/lib/shop";
import { checkoutSchema, fieldErrorsOf } from "@/lib/validation";
import type { ActionResult } from "@/lib/validation";

export async function placeOrder(input: unknown): Promise<ActionResult & { orderId?: string }> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: "انتهت الجلسة، يرجى تسجيل الدخول مجددًا" };

    const parsed = checkoutSchema.safeParse(input);
    if (!parsed.success) return { error: "يرجى مراجعة بيانات الطلب", fieldErrors: fieldErrorsOf(parsed.error) };
    const d = parsed.data;

    const merged = new Map<string, { brand: string; productId: string; qty: number }>();
    for (const i of d.items) {
        const key = `${i.brand}/${i.productId}`;
        const prev = merged.get(key);
        merged.set(key, { ...i, qty: (prev?.qty ?? 0) + i.qty });
    }

    const lines: { brand: string; productId: string; name: string; qty: number; price: number }[] = [];
    for (const i of merged.values()) {
        const product = isBrandId(i.brand) ? findProduct(i.brand, i.productId) : undefined;
        if (!product) return { error: "بعض المنتجات في السلة لم تعد متوفرة، حدّث السلة وحاول مرة أخرى" };
        lines.push({ brand: i.brand, productId: i.productId, name: product.name, qty: i.qty, price: product.price });
    }

    let city = d.city;
    let street = d.street;
    if (d.addressId) {
        const saved = await db.address.findFirst({ where: { id: d.addressId, userId } });
        if (!saved) return { error: "عنوان التوصيل غير موجود" };
        city = saved.city;
        street = saved.street;
    }

    const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
    const fee = shippingFee(d.shippingMethod, subtotal);
    const method = SHIPPING_METHODS.find((m) => m.id === d.shippingMethod)!;

    const order = await db.$transaction(async (tx) => {
        if (!d.addressId && d.saveAddress) {
            const hasAny = (await tx.address.count({ where: { userId } })) > 0;
            await tx.address.create({
                data: { userId, label: "عنوان التوصيل", kind: "HOME", city, street, phone: d.phone, isDefault: !hasAny },
            });
        }
        return tx.order.create({
            data: {
                userId,
                subtotal,
                shippingFee: fee,
                total: subtotal + fee,
                shippingMethod: method.label,
                recipientName: d.recipientName,
                phone: d.phone,
                city,
                street,
                notes: d.notes || null,
                items: { create: lines },
            },
            select: { id: true },
        });
    });

    return { success: "تم استلام طلبك بنجاح", orderId: order.id };
}

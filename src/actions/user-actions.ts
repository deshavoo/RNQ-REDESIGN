"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { addressSchema, fieldErrorsOf, passwordSchema, profileSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/validation";
import { toClientAddress } from "@/lib/profile";
import type { ClientAddress } from "@/lib/profile";

const NOT_SIGNED_IN: ActionResult = { error: "انتهت الجلسة، يرجى تسجيل الدخول مجددًا" };

async function currentUserId() {
    const session = await auth();
    return session?.user?.id ?? null;
}

export async function updateProfile(input: unknown): Promise<ActionResult> {
    const userId = await currentUserId();
    if (!userId) return NOT_SIGNED_IN;

    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) return { error: "يرجى مراجعة البيانات المدخلة", fieldErrors: fieldErrorsOf(parsed.error) };

    await db.user.update({ where: { id: userId }, data: parsed.data });
    return { success: "تم تحديث بياناتك بنجاح" };
}

export async function updatePassword(input: unknown): Promise<ActionResult> {
    const userId = await currentUserId();
    if (!userId) return NOT_SIGNED_IN;

    const parsed = passwordSchema.safeParse(input);
    if (!parsed.success) return { error: "يرجى مراجعة البيانات المدخلة", fieldErrors: fieldErrorsOf(parsed.error) };

    const user = await db.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
    if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) {
        return { fieldErrors: { currentPassword: ["كلمة المرور الحالية غير صحيحة"] } };
    }

    await db.user.update({
        where: { id: userId },
        data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
    });
    return { success: "تم تغيير كلمة المرور" };
}

type AddressResult = ActionResult & { addresses?: ClientAddress[] };

async function listAddresses(userId: string) {
    const rows = await db.address.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return rows.map(toClientAddress);
}

export async function saveAddress(input: unknown): Promise<AddressResult> {
    const userId = await currentUserId();
    if (!userId) return NOT_SIGNED_IN;

    const parsed = addressSchema.safeParse(input);
    if (!parsed.success) return { error: "يرجى مراجعة بيانات العنوان", fieldErrors: fieldErrorsOf(parsed.error) };
    const { id, ...data } = parsed.data;

    if (id && !(await db.address.findFirst({ where: { id, userId }, select: { id: true } }))) {
        return { error: "العنوان غير موجود" };
    }

    const count = await db.address.count({ where: { userId } });
    const isDefault = data.isDefault || count === 0 || (count === 1 && !!id);

    await db.$transaction(async (tx) => {
        if (isDefault) await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
        if (id) {
            await tx.address.update({ where: { id }, data: { ...data, isDefault } });
        } else {
            await tx.address.create({ data: { ...data, isDefault, userId } });
        }
    });

    return { success: id ? "تم تحديث العنوان" : "تمت إضافة العنوان", addresses: await listAddresses(userId) };
}

export async function deleteAddress(id: string): Promise<AddressResult> {
    const userId = await currentUserId();
    if (!userId) return NOT_SIGNED_IN;

    const target = await db.address.findFirst({ where: { id, userId } });
    if (!target) return { error: "العنوان غير موجود" };

    await db.$transaction(async (tx) => {
        await tx.address.delete({ where: { id } });
        if (target.isDefault) {
            const next = await tx.address.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } });
            if (next) await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
        }
    });

    return { success: "تم حذف العنوان", addresses: await listAddresses(userId) };
}

export async function removeFromWishlist(brand: string, productId: string): Promise<ActionResult> {
    const userId = await currentUserId();
    if (!userId) return NOT_SIGNED_IN;

    await db.wishlistItem.deleteMany({ where: { userId, brand, productId } });
    return { success: "تمت الإزالة من المفضلة" };
}

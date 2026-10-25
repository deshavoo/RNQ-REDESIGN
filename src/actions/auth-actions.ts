"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { businessSchema, fieldErrorsOf, individualSchema } from "@/lib/validation";
import type { ActionResult } from "@/lib/validation";

const HASH_ROUNDS = 12;

const isUniqueViolation = (e: unknown) =>
    typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "P2002";

const DUPLICATE: ActionResult = { error: "هذه البيانات مسجلة مسبقًا، جرّب تسجيل الدخول" };

export async function registerIndividual(input: unknown): Promise<ActionResult> {
    const parsed = individualSchema.safeParse(input);
    if (!parsed.success) return { error: "يرجى مراجعة البيانات المدخلة", fieldErrors: fieldErrorsOf(parsed.error) };
    const { name, email, phone, password } = parsed.data;

    if (await db.user.findUnique({ where: { email }, select: { id: true } })) {
        return { fieldErrors: { email: ["هذا البريد مسجل مسبقًا، جرّب تسجيل الدخول"] } };
    }

    try {
        await db.user.create({
            data: { name, email, phone, passwordHash: await bcrypt.hash(password, HASH_ROUNDS) },
        });
    } catch (e) {
        if (isUniqueViolation(e)) return DUPLICATE;
        throw e;
    }
    return { success: "تم إنشاء حسابك بنجاح" };
}

export async function registerBusiness(input: unknown): Promise<ActionResult> {
    const parsed = businessSchema.safeParse(input);
    if (!parsed.success) return { error: "يرجى مراجعة البيانات المدخلة", fieldErrors: fieldErrorsOf(parsed.error) };
    const d = parsed.data;

    const [emailTaken, crTaken] = await Promise.all([
        db.user.findUnique({ where: { email: d.email }, select: { id: true } }),
        db.company.findUnique({ where: { crNumber: d.crNumber }, select: { id: true } }),
    ]);
    if (emailTaken || crTaken) {
        return {
            fieldErrors: {
                ...(emailTaken && { email: ["هذا البريد مسجل مسبقًا، جرّب تسجيل الدخول"] }),
                ...(crTaken && { crNumber: ["هذا السجل التجاري مسجل بحساب آخر، تواصل معنا إن كان ذلك خطأ"] }),
            },
        };
    }

    try {
        await db.user.create({
            data: {
                name: d.name,
                email: d.email,
                phone: d.phone,
                passwordHash: await bcrypt.hash(d.password, HASH_ROUNDS),
                accountType: "BUSINESS",
                company: {
                    create: {
                        name: d.companyName,
                        crNumber: d.crNumber,
                        vatNumber: d.vatNumber,
                        businessType: d.businessType,
                        city: d.city,
                    },
                },
            },
        });
    } catch (e) {
        if (isUniqueViolation(e)) return DUPLICATE;
        throw e;
    }
    return { success: "تم استلام طلب حساب الشركة، وسنراجعه خلال يوم عمل" };
}

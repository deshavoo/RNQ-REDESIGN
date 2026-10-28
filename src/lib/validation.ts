import { z } from "zod";
import { MAX_QTY } from "./shop";
import { REGIONS, REGION_IDS, SHIPPING_METHOD_IDS, normalizePhone, phoneRegion } from "./regions";
import type { RegionId } from "./regions";

const PHONE_ERROR = "رقم جوال غير صحيح (سعودي 05XXXXXXXX أو مصري 01XXXXXXXXX)";

const phone = z
    .string()
    .trim()
    .refine((v) => phoneRegion(v) !== null, { error: PHONE_ERROR })
    .transform((v) => normalizePhone(v, phoneRegion(v)!)!);

const country = z.enum(REGION_IDS as [RegionId, ...RegionId[]], { error: "اختر دولة التوصيل" });

const phoneErrorFor = (region: RegionId) =>
    `رقم جوال غير صحيح في ${REGIONS[region].name} (مثال: ${REGIONS[region].phoneExample})`;

const email = z.string().trim().toLowerCase().pipe(z.email({ error: "صيغة البريد الإلكتروني غير صحيحة" }));

const newPassword = z
    .string()
    .min(8, { error: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" })
    .max(72, { error: "كلمة المرور طويلة جداً" });

const name = z.string().trim().min(2, { error: "أدخل الاسم الكامل" }).max(80, { error: "الاسم طويل جداً" });

export const loginSchema = z.object({
    email,
    password: z.string().min(1, { error: "أدخل كلمة المرور" }),
});

export const individualSchema = z
    .object({
        name,
        email,
        phone,
        password: newPassword,
        confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, { error: "كلمتا المرور غير متطابقتين", path: ["confirm"] });

export const BUSINESS_TYPES = [
    { id: "hotel", label: "فندق" },
    { id: "cafe", label: "مقهى أو مطعم" },
    { id: "corporate", label: "شركة أو مكتب" },
    { id: "retail", label: "متجر أو تموينات" },
    { id: "events", label: "تنظيم مناسبات" },
    { id: "other", label: "أخرى" },
] as const;

export const businessSchema = z
    .object({
        companyName: z.string().trim().min(2, { error: "أدخل اسم المنشأة" }).max(120),
        crNumber: z.string().trim().regex(/^\d{10}$/, { error: "يتكون رقم السجل التجاري من 10 أرقام" }),
        vatNumber: z
            .string()
            .trim()
            .refine((v) => v === "" || /^3\d{13}3$/.test(v), { error: "يتكون الرقم الضريبي من 15 رقمًا ويبدأ وينتهي بالرقم 3" })
            .transform((v) => v || undefined),
        businessType: z.enum(BUSINESS_TYPES.map((t) => t.id) as [string, ...string[]], { error: "اختر نوع النشاط" }),
        city: z.string().trim().min(2, { error: "أدخل المدينة" }).max(60),
        name,
        email,
        phone,
        password: newPassword,
        confirm: z.string(),
        terms: z.literal(true, { error: "يجب الموافقة على الشروط والأحكام" }),
    })
    .refine((d) => d.password === d.confirm, { error: "كلمتا المرور غير متطابقتين", path: ["confirm"] });

export const profileSchema = z.object({
    name,
    phone,
    birthday: z
        .string()
        .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), { error: "تاريخ غير صحيح" })
        .transform((v) => (v ? new Date(v) : null)),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, { error: "أدخل كلمة المرور الحالية" }),
    newPassword,
});

export const addressSchema = z.object({
    id: z.string().optional(),
    label: z.string().trim().min(1, { error: "أدخل اسم العنوان" }).max(40),
    kind: z.enum(["HOME", "WORK", "OTHER"]),
    city: z.string().trim().min(2, { error: "أدخل المدينة" }).max(60),
    street: z.string().trim().min(3, { error: "أدخل العنوان بالتفصيل" }).max(200),
    phone: z.string().trim(),
    country,
    isDefault: z.boolean(),
})
    .superRefine((d, ctx) => {
        if (!normalizePhone(d.phone, d.country)) ctx.addIssue({ code: "custom", path: ["phone"], message: phoneErrorFor(d.country) });
    })
    .transform((d) => ({ ...d, phone: normalizePhone(d.phone, d.country)! }));

export type FieldErrors = Record<string, string[] | undefined>;

export type ActionResult = { success?: string; error?: string; fieldErrors?: FieldErrors };

export const fieldErrorsOf = (err: z.ZodError): FieldErrors => z.flattenError(err).fieldErrors;

export const checkoutSchema = z
    .object({
        items: z
            .array(z.object({ brand: z.string(), productId: z.string(), qty: z.number().int().min(1).max(MAX_QTY, { error: `الحد الأقصى ${MAX_QTY} قطعة لكل منتج` }) }))
            .min(1, { error: "السلة فارغة" })
            .max(50),
        country,
        shippingMethod: z.enum(SHIPPING_METHOD_IDS, { error: "اختر طريقة الشحن" }),
        paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD"]),
        addressId: z.string().optional(),
        recipientName: name,
        phone: z.string().trim(),
        city: z.string().trim().max(60),
        street: z.string().trim().max(200),
        saveAddress: z.boolean(),
        notes: z.string().trim().max(500, { error: "الملاحظات طويلة جداً" }),
        isGift: z.boolean(),
        senderName: z.string().trim().max(80),
        senderPhone: z.string().trim(),
        giftMessage: z.string().trim().max(300, { error: "رسالة الإهداء طويلة جداً" }),
    })
    .superRefine((d, ctx) => {
        if (d.paymentMethod === "CARD") ctx.addIssue({ code: "custom", path: ["paymentMethod"], message: "الدفع بالبطاقة غير متاح حالياً" });
        if (!normalizePhone(d.phone, d.country)) ctx.addIssue({ code: "custom", path: ["phone"], message: phoneErrorFor(d.country) });
        if (d.isGift) {
            if (d.senderName.length < 2) ctx.addIssue({ code: "custom", path: ["senderName"], message: "أدخل اسم المرسل" });
            if (!phoneRegion(d.senderPhone)) ctx.addIssue({ code: "custom", path: ["senderPhone"], message: PHONE_ERROR });
        }
        if (d.addressId) return;
        if (d.city.length < 2) ctx.addIssue({ code: "custom", path: ["city"], message: "أدخل المدينة" });
        if (d.street.length < 3) ctx.addIssue({ code: "custom", path: ["street"], message: "أدخل العنوان بالتفصيل" });
    })
    .transform((d) => {
        const senderRegion = d.isGift ? phoneRegion(d.senderPhone) : null;
        return {
            ...d,
            phone: normalizePhone(d.phone, d.country)!,
            senderName: d.isGift ? d.senderName : "",
            senderPhone: senderRegion ? normalizePhone(d.senderPhone, senderRegion)! : "",
            giftMessage: d.isGift ? d.giftMessage : "",
        };
    });

export type CheckoutInput = z.input<typeof checkoutSchema>;

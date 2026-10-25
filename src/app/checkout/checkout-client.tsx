"use client";

import { useId, useState } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Banknote, CheckCircle2, Loader2, MapPin, Plus, Truck } from "lucide-react";
import { placeOrder } from "@/actions/order-actions";
import { CartSkeleton, EmptyCart } from "@/components/cart/CartStates";
import { cart, useCart, useHydrated } from "@/components/cart/cart-store";
import { formatPrice } from "@/components/brands";
import { goldFill } from "@/components/theme";
import type { ClientAddress } from "@/lib/profile";
import { SHIPPING_METHODS, shippingFee } from "@/lib/shop";
import type { ShippingMethodId } from "@/lib/shop";
import type { FieldErrors } from "@/lib/validation";

const NEW = "new";

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black placeholder:text-black/35 outline-none transition " +
    "focus:border-gold focus:ring-2 focus:ring-gold/40 aria-invalid:border-rose-500";

const optionCls =
    "flex cursor-pointer items-start gap-3 rounded-2xl border border-black/15 p-4 transition-colors hover:border-gold/60 " +
    "has-checked:border-black has-checked:bg-black/3 has-focus-visible:ring-2 has-focus-visible:ring-gold";

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
    return (
        <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-black" style={{ backgroundImage: goldFill }}>{step}</span>
                {title}
            </h2>
            {children}
        </section>
    );
}

function Field({ label, error, className = "", ...rest }: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
    const id = useId();
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-black">{label}</label>
            <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} className={inputCls} {...rest} />
            {error && <p id={`${id}-e`} className="mt-1.5 text-xs font-semibold text-rose-700">{error}</p>}
        </div>
    );
}

function Confirmation({ orderId }: { orderId: string }) {
    return (
        <div className="mx-auto max-w-lg animate-fade-up rounded-3xl border border-gold/40 bg-white px-6 py-12 text-center">
            <CheckCircle2 size={56} className="mx-auto text-gold" aria-hidden />
            <h1 className="mt-5 text-2xl font-semibold text-black sm:text-3xl">تم استلام طلبك</h1>
            <p className="mt-3 text-black/65">
                رقم الطلب <span dir="ltr" className="font-bold text-black">#{orderId.slice(-8).toUpperCase()}</span>
            </p>
            <p className="mt-2 text-sm text-black/55">سنتواصل معك لتأكيد موعد التوصيل، والدفع عند الاستلام.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/profile?tab=orders" className="inline-flex min-h-12 items-center justify-center rounded-full px-7 font-bold text-black" style={{ backgroundImage: goldFill }}>
                    عرض طلباتي
                </Link>
                <Link href="/products" className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold/60 px-7 font-bold text-black hover:text-gold-deep">
                    متابعة التسوق
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutClient({ name, phone, addresses }: { name: string; phone: string; addresses: ClientAddress[] }) {
    const hydrated = useHydrated();
    const { lines, subtotal } = useCart();
    const [addressId, setAddressId] = useState(addresses[0]?.id ?? NEW);
    const [method, setMethod] = useState<ShippingMethodId>(SHIPPING_METHODS[0].id);
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    const fee = shippingFee(method, subtotal);
    const isNew = addressId === NEW;

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setPending(true);
        setFormError(null);
        try {
            const res = await placeOrder({
                items: lines.map(({ brand, productId, qty }) => ({ brand, productId, qty })),
                shippingMethod: method,
                addressId: isNew ? undefined : addressId,
                recipientName: String(f.get("recipientName") ?? ""),
                phone: String(f.get("phone") ?? ""),
                city: String(f.get("city") ?? ""),
                street: String(f.get("street") ?? ""),
                saveAddress: f.get("saveAddress") === "on",
                notes: String(f.get("notes") ?? ""),
            });
            setErrors(res.fieldErrors ?? {});
            if (res.orderId) {
                cart.clear();
                setOrderId(res.orderId);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setFormError(res.error ?? null);
            }
        } catch {
            setFormError("تعذّر إرسال الطلب، حاول مرة أخرى");
        }
        setPending(false);
    };

    return (
        <main dir="rtl" lang="ar" className="min-h-[60vh] bg-[#faf7ef] px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-6xl">
                {orderId ? (
                    <Confirmation orderId={orderId} />
                ) : (
                    <>
                        <h1 className="mb-8 text-3xl font-semibold text-black sm:text-4xl">إتمام الطلب</h1>
                        {!hydrated ? (
                            <CartSkeleton />
                        ) : lines.length === 0 ? (
                            <EmptyCart />
                        ) : (
                            <form onSubmit={submit} noValidate className="grid animate-fade-up gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
                                <div className="space-y-6">
                                    <Section step={1} title="عنوان التوصيل">
                                        <div className="grid gap-3">
                                            {addresses.map((a) => (
                                                <label key={a.id} className={optionCls}>
                                                    <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1 h-4 w-4 accent-black" />
                                                    <span>
                                                        <span className="flex items-center gap-2 font-semibold text-black"><MapPin size={15} className="text-gold-deep" aria-hidden />{a.label}</span>
                                                        <span className="mt-0.5 block text-sm text-black/60">{a.city}، {a.street}</span>
                                                    </span>
                                                </label>
                                            ))}
                                            <label className={optionCls}>
                                                <input type="radio" name="address" checked={isNew} onChange={() => setAddressId(NEW)} className="mt-1 h-4 w-4 accent-black" />
                                                <span className="flex items-center gap-2 font-semibold text-black"><Plus size={15} className="text-gold-deep" aria-hidden />عنوان جديد</span>
                                            </label>
                                        </div>

                                        {isNew && (
                                            <div className="mt-5 grid animate-fade-up gap-4 sm:grid-cols-2">
                                                <Field label="المدينة" name="city" autoComplete="address-level2" error={errors.city?.[0]} />
                                                <Field label="العنوان بالتفصيل" name="street" autoComplete="street-address" placeholder="الحي، الشارع، رقم المبنى" error={errors.street?.[0]} />
                                                <label className="flex items-center gap-3 text-sm font-semibold text-black sm:col-span-2">
                                                    <input type="checkbox" name="saveAddress" defaultChecked className="h-5 w-5 accent-gold" />
                                                    احفظ العنوان في حسابي
                                                </label>
                                            </div>
                                        )}

                                        <div className="mt-5 grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-2">
                                            <Field label="اسم المستلم" name="recipientName" defaultValue={name} autoComplete="name" error={errors.recipientName?.[0]} />
                                            <Field label="جوال المستلم" name="phone" type="tel" dir="ltr" defaultValue={phone} placeholder="05XXXXXXXX" autoComplete="tel" error={errors.phone?.[0]} />
                                        </div>
                                    </Section>

                                    <Section step={2} title="طريقة الشحن">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {SHIPPING_METHODS.map((m) => {
                                                const cost = shippingFee(m.id, subtotal);
                                                return (
                                                    <label key={m.id} className={optionCls}>
                                                        <input type="radio" name="shippingMethod" checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1 h-4 w-4 accent-black" />
                                                        <span className="flex-1">
                                                            <span className="flex items-center justify-between gap-2 font-semibold text-black">
                                                                <span className="flex items-center gap-2"><Truck size={15} className="text-gold-deep" aria-hidden />{m.label}</span>
                                                                <span className="text-sm">{cost === 0 ? "مجاني" : formatPrice(cost)}</span>
                                                            </span>
                                                            <span className="mt-0.5 block text-sm text-black/60">{m.eta}</span>
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </Section>

                                    <Section step={3} title="الدفع والملاحظات">
                                        <div className="flex items-center gap-3 rounded-2xl border border-black bg-black/3 p-4">
                                            <Banknote size={20} className="text-gold-deep" aria-hidden />
                                            <span>
                                                <span className="block font-semibold text-black">الدفع عند الاستلام</span>
                                                <span className="block text-sm text-black/60">ادفع قيمة الطلب عند وصوله</span>
                                            </span>
                                        </div>
                                        <label className="mt-5 block">
                                            <span className="mb-1.5 block text-sm font-semibold text-black">ملاحظات على الطلب (اختياري)</span>
                                            <textarea name="notes" rows={3} maxLength={500} className={inputCls} placeholder="مثال: التوصيل بعد العصر" />
                                        </label>
                                    </Section>
                                </div>

                                <aside aria-label="ملخص الطلب" className="h-fit rounded-3xl border border-gold/30 bg-white p-6 lg:sticky lg:top-32">
                                    <h2 className="text-lg font-bold text-black">ملخص الطلب</h2>
                                    <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
                                        {lines.map((l) => (
                                            <li key={`${l.brand}/${l.productId}`} className="flex items-center gap-3">
                                                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f6f1e4]">
                                                    {l.product.image && <Image src={l.product.image} alt="" fill sizes="56px" className="object-cover" />}
                                                    <span className="absolute top-0 end-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-bold text-gold-soft">{l.qty}</span>
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm text-black">{l.product.name}</span>
                                                <span className="text-sm font-semibold text-black">{formatPrice(l.total)}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <dl className="mt-5 space-y-3 border-t border-black/10 pt-5 text-sm">
                                        <div className="flex justify-between"><dt className="text-black/60">المجموع الفرعي</dt><dd className="font-semibold">{formatPrice(subtotal)}</dd></div>
                                        <div className="flex justify-between"><dt className="text-black/60">التوصيل</dt><dd className="font-semibold">{fee === 0 ? "مجاني" : formatPrice(fee)}</dd></div>
                                        <div className="flex justify-between border-t border-black/10 pt-3 text-base"><dt className="font-bold">الإجمالي</dt><dd className="font-bold">{formatPrice(subtotal + fee)}</dd></div>
                                    </dl>

                                    {formError && (
                                        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 ring-1 ring-rose-200">
                                            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
                                            {formError}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={pending}
                                        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-bold text-black transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
                                        style={{ backgroundImage: goldFill }}
                                    >
                                        {pending && <Loader2 size={18} className="animate-spin" aria-hidden />}
                                        تأكيد الطلب · {formatPrice(subtotal + fee)}
                                    </button>
                                    <p className="mt-3 text-center text-xs text-black/50">
                                        بتأكيد الطلب أنت توافق على <Link href="/legal/terms" className="underline underline-offset-2">الشروط والأحكام</Link> و<Link href="/legal/returns" className="underline underline-offset-2">سياسة الاسترجاع</Link>.
                                    </p>
                                </aside>
                            </form>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
    AlertCircle, BadgeCheck, Briefcase, Building2, CalendarDays, CheckCircle2, Clock, Crown, Eye,
    Gift, Heart, Home, Loader2, Lock, LogOut, Mail, MapPin, Menu, Pencil, Phone, Plus, RotateCcw,
    ShoppingBag, Trash2, UserRound, X, XCircle,
} from "lucide-react";
import { deleteAddress, removeFromWishlist, saveAddress, updatePassword, updateProfile } from "@/actions/user-actions";
import { findProduct, formatPrice, isBrandId } from "@/components/brands";
import Flag from "@/components/region/Flag";
import Price from "@/components/region/Price";
import { useRegion } from "@/components/region/region-store";
import { REGIONS, REGION_IDS } from "@/lib/regions";
import type { RegionId } from "@/lib/regions";
import { cart } from "@/components/cart/cart-store";
import type { ActionResult, FieldErrors } from "@/lib/validation";
import type { ClientAddress, ClientOrder, ClientWishItem, ProfileUser } from "@/lib/profile";

const STATUS: Record<ClientOrder["status"], { label: string; cls: string }> = {
    PROCESSING: { label: "قيد التنفيذ", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
    DELIVERED: { label: "تم التوصيل", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
    CANCELLED: { label: "ملغي", cls: "bg-rose-50 text-rose-800 ring-rose-200" },
};

const TABS = [
    { id: "orders", label: "الطلبات السابقة", icon: ShoppingBag },
    { id: "addresses", label: "عناوين التوصيل", icon: MapPin },
    { id: "account", label: "تفاصيل الحساب", icon: UserRound },
    { id: "wishlist", label: "المفضلة", icon: Heart },
] as const;
export type TabId = (typeof TABS)[number]["id"];

const ADDR_KIND = [
    { id: "HOME", label: "المنزل", icon: Home },
    { id: "WORK", label: "العمل", icon: Briefcase },
    { id: "OTHER", label: "آخر", icon: MapPin },
] as const;

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black placeholder:text-black/35 outline-none transition " +
    "focus:border-brand focus:ring-2 focus:ring-brand/40 aria-invalid:border-rose-500 disabled:bg-black/4 disabled:text-black/50";

const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-brand-soft transition-colors " +
    "hover:bg-[linear-gradient(135deg,#1f7a52,#005430_55%,#003d23)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60";

const btnGhost =
    "inline-flex items-center justify-center gap-2 rounded-full border border-brand/50 bg-white px-4 py-2.5 text-sm font-semibold text-black " +
    "transition-colors hover:border-brand hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

function addToCart(brand: string, productId: string, quantity: number) {
    if (!isBrandId(brand) || !findProduct(brand, productId)) return false;
    cart.add(brand, productId, quantity);
    return true;
}

function Field({ label, icon, error, children }: { label: string; icon?: ReactNode; error?: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-black">
                {icon}
                {label}
            </span>
            {children}
            {error && <span className="mt-1.5 block text-xs font-semibold text-rose-700">{error}</span>}
        </label>
    );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-3xl border border-brand/30 bg-white p-6 shadow-2xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-black">{title}</h3>
                    <button onClick={onClose} aria-label="إغلاق" className="rounded-full p-2 text-black hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

interface ToastState { type: "success" | "error"; message: string }

function Toast({ toast, onDone }: { toast: ToastState | null; onDone: () => void }) {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onDone, 3500);
        return () => clearTimeout(t);
    }, [toast, onDone]);
    if (!toast) return null;
    const ok = toast.type === "success";
    return (
        <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-6 z-60 flex justify-center">
            <div className={`flex animate-fade-up items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl ring-1 ${ok ? "bg-brand text-white ring-brand/50" : "bg-rose-700 text-white ring-rose-300"}`}>
                {ok ? <CheckCircle2 size={20} className="text-brand-soft" /> : <AlertCircle size={20} />}
                {toast.message}
            </div>
        </div>
    );
}

type Notify = (t: ToastState) => void;

function report(res: ActionResult, notify: Notify) {
    if (res.success) notify({ type: "success", message: res.success });
    else notify({ type: "error", message: res.error ?? Object.values(res.fieldErrors ?? {})[0]?.[0] ?? "تعذّر حفظ التغييرات" });
    return !!res.success;
}

const COMPANY_STATUS = {
    PENDING: { label: "قيد المراجعة", text: "نراجع بيانات منشأتك الآن، وتُفعّل أسعار الجملة بعد الموافقة.", icon: Clock, cls: "bg-amber-400/15 text-amber-200 ring-amber-300/40" },
    APPROVED: { label: "حساب معتمد", text: "حسابك مفعّل، وتظهر لك أسعار الجملة والطلبات المتكررة.", icon: BadgeCheck, cls: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/40" },
    REJECTED: { label: "لم يُعتمد", text: "لم نتمكن من اعتماد الطلب. تواصل معنا لمراجعة البيانات.", icon: XCircle, cls: "bg-rose-400/15 text-rose-200 ring-rose-300/40" },
} as const;

function ProfileHeader({ user }: { user: ProfileUser }) {
    const span = user.nextTier ? user.nextTierPoints : Math.max(user.points, 1);
    const progress = Math.min(100, Math.round((user.points / span) * 100));
    const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
    const company = user.company;
    const status = company && COMPANY_STATUS[company.status];

    return (
        <section className="relative isolate overflow-hidden rounded-3xl border border-brand/30 bg-linear-to-bl from-[#1f7a52] via-brand to-brand text-white shadow-xl">
            <div aria-hidden className="pointer-events-none absolute -inset-s-20 -top-24 -z-10 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl motion-reduce:animate-none" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 inset-e-10 -z-10 h-64 w-64 animate-float-slow rounded-full bg-white/10 blur-3xl motion-reduce:animate-none" />
            <span aria-hidden className="pointer-events-none absolute -bottom-10 inset-s-4 -z-10 select-none text-[9rem] font-black leading-none text-brand-soft/[0.07] sm:text-[12rem]">
                RNQ
            </span>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div className="flex animate-fade-up flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
                    <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border-2 border-brand-soft bg-brand-deep text-3xl font-bold text-brand-soft shadow-[0_0_30px_rgba(201,221,208,0.3)]">
                        {company ? <Building2 size={40} aria-hidden /> : initials}
                    </div>

                    <div className="min-w-0 space-y-2">
                        <h1 className="text-2xl font-semibold sm:text-3xl">{company?.name ?? user.name}</h1>
                        <ul className="space-y-1 text-sm text-white/75">
                            {company && <li className="flex items-center justify-center gap-2 sm:justify-start"><UserRound size={15} className="text-brand-soft" />{user.name}</li>}
                            <li className="flex items-center justify-center gap-2 sm:justify-start"><Mail size={15} className="text-brand-soft" />{user.email}</li>
                            {user.phone && <li className="flex items-center justify-center gap-2 sm:justify-start"><Phone size={15} className="text-brand-soft" /><span dir="ltr">{user.phone}</span></li>}
                            <li className="flex items-center justify-center gap-2 sm:justify-start"><CalendarDays size={15} className="text-brand-soft" />عضو منذ {user.joined}</li>
                        </ul>
                    </div>
                </div>

                {status ? (
                    <div className="animate-fade-up rounded-2xl border border-brand/40 bg-white/5 p-5 backdrop-blur [animation-delay:120ms]">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ring-1 ${status.cls}`}>
                            <status.icon size={16} aria-hidden />
                            {status.label}
                        </span>
                        <p className="mt-3 text-sm leading-relaxed text-white/80">{status.text}</p>
                        <p className="mt-3 text-xs text-white/55">
                            السجل التجاري <span dir="ltr">{company.crNumber}</span> · {company.businessType} · {company.city}
                        </p>
                    </div>
                ) : (
                    <div className="animate-fade-up rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur [animation-delay:120ms]">
                        <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-brand bg-white">
                                <Crown size={16} />
                                {user.tier}
                            </span>
                            <p className="text-end">
                                <span className="text-2xl font-bold text-brand-soft">{user.points.toLocaleString("ar-SA")}</span>
                                <span className="ms-1 text-sm text-white/70">نقطة</span>
                            </p>
                        </div>
                        <div
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={span}
                            aria-valuenow={user.points}
                            aria-label="التقدم نحو المستوى التالي"
                            className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"
                        >
                            <div className="h-full rounded-full bg-brand-soft transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mt-2.5 text-sm text-white/80">
                            {user.nextTier
                                ? `تبقّى ${(user.nextTierPoints - user.points).toLocaleString("ar-SA")} نقطة للوصول إلى ${user.nextTier}`
                                : "وصلت إلى أعلى مستوى عضوية"}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-brand/50 bg-white p-10 text-center">
            <p className="mb-5 text-black/65">{text}</p>
            <Link href="/products" className={btnPrimary}>تصفح المنتجات</Link>
        </div>
    );
}

function OrdersTab({ orders, notify }: { orders: ClientOrder[]; notify: Notify }) {
    const [selected, setSelected] = useState<ClientOrder | null>(null);

    const reorder = (o: ClientOrder) => {
        const added = o.items.filter((i) => addToCart(i.brand, i.productId, i.qty)).length;
        if (added === 0) notify({ type: "error", message: "منتجات هذا الطلب لم تعد متوفرة" });
        else if (added < o.items.length) notify({ type: "success", message: "أُضيفت المنتجات المتوفرة فقط إلى السلة" });
        else notify({ type: "success", message: "أُضيفت منتجات الطلب إلى السلة" });
    };

    if (orders.length === 0) return <EmptyState text="لم تقم بأي طلب بعد." />;

    return (
        <>
            <ul className="space-y-4">
                {orders.map((o) => (
                    <li key={o.id} className="rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-brand/60">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="font-bold text-black">طلب <span dir="ltr">#{o.id.slice(-8).toUpperCase()}</span></p>
                                <p className="flex items-center gap-2 text-sm text-black/55">
                                    <Flag region={o.country} />
                                    {REGIONS[o.country].name} · {o.date}
                                    {o.isGift && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand-deep">هدية</span>}
                                </p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                            <p className="text-lg font-bold text-black">{formatPrice(o.total, o.country)}</p>
                            <div className="flex gap-2">
                                <button className={btnGhost} onClick={() => setSelected(o)}><Eye size={16} />التفاصيل</button>
                                <button className={`${btnPrimary} px-4! py-2.5! text-sm`} onClick={() => reorder(o)}><RotateCcw size={16} />إعادة الطلب</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {selected && (
                <Modal title={`تفاصيل الطلب #${selected.id.slice(-8).toUpperCase()}`} onClose={() => setSelected(null)}>
                    <ul className="divide-y divide-black/10">
                        {selected.items.map((it) => (
                            <li key={`${it.brand}-${it.productId}`} className="flex items-center justify-between gap-4 py-3">
                                <span className="text-black">{it.name} <span className="text-black/50">× {it.qty}</span></span>
                                <span className="font-semibold text-black">{formatPrice(it.price * it.qty, selected.country)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-brand/10 px-4 py-3">
                        <span className="font-semibold text-black">الإجمالي</span>
                        <span className="text-lg font-bold text-black">{formatPrice(selected.total, selected.country)}</span>
                    </div>
                </Modal>
            )}
        </>
    );
}

function AddressesTab({ addresses, notify }: { addresses: ClientAddress[]; notify: Notify }) {
    const [list, setList] = useState(addresses);
    const [editing, setEditing] = useState<ClientAddress | "new" | null>(null);
    const region = useRegion();
    const [addrCountry, setAddrCountry] = useState<RegionId>(region);
    const openEditor = (target: ClientAddress | "new") => {
        setAddrCountry(target === "new" ? region : target.country);
        setEditing(target);
    };
    const [toDelete, setToDelete] = useState<ClientAddress | null>(null);
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const current = editing && editing !== "new" ? editing : null;
    const close = useCallback(() => { setEditing(null); setErrors({}); }, []);
    const closeDelete = useCallback(() => setToDelete(null), []);

    const save = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setPending(true);
        try {
            const res = await saveAddress({
                id: current?.id,
                label: String(f.get("label") ?? ""),
                kind: String(f.get("kind") ?? "OTHER"),
                country: String(f.get("country") ?? "SA"),
                city: String(f.get("city") ?? ""),
                street: String(f.get("street") ?? ""),
                phone: String(f.get("phone") ?? ""),
                isDefault: f.get("isDefault") === "on",
            });
            if (res.addresses) setList(res.addresses);
            setErrors(res.fieldErrors ?? {});
            if (report(res, notify)) close();
        } catch {
            notify({ type: "error", message: "حدث خطأ غير متوقع" });
        }
        setPending(false);
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setPending(true);
        try {
            const res = await deleteAddress(toDelete.id);
            if (res.addresses) setList(res.addresses);
            if (report(res, notify)) setToDelete(null);
        } catch {
            notify({ type: "error", message: "حدث خطأ غير متوقع" });
        }
        setPending(false);
    };

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                {list.map((a) => {
                    const Icon = ADDR_KIND.find((k) => k.id === a.kind)?.icon ?? MapPin;
                    return (
                        <article key={a.id} className="flex flex-col rounded-2xl border border-black/10 bg-white p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 font-bold text-black">
                                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-soft"><Icon size={17} /></span>
                                    {a.label}
                                </h3>
                                {a.isDefault && <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-brand-deep">الافتراضي</span>}
                            </div>
                            <p className="flex items-center gap-2 text-black"><Flag region={a.country} />{REGIONS[a.country].name}، {a.city}</p>
                            <p className="text-sm text-black/65">{a.street}</p>
                            <p className="mt-1 text-end text-sm text-black/65" dir="ltr">{a.phone}</p>
                            <div className="mt-4 flex gap-2 border-t border-black/10 pt-4">
                                <button className={btnGhost} onClick={() => openEditor(a)}><Pencil size={15} />تعديل</button>
                                <button className={`${btnGhost} text-rose-700! hover:border-rose-300!`} onClick={() => setToDelete(a)}><Trash2 size={15} />حذف</button>
                            </div>
                        </article>
                    );
                })}

                <button
                    onClick={() => openEditor("new")}
                    className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/60 bg-white text-black transition-colors hover:bg-brand/5 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                    <Plus size={26} />
                    <span className="font-semibold">إضافة عنوان جديد</span>
                </button>
            </div>

            {editing && (
                <Modal title={editing === "new" ? "إضافة عنوان جديد" : "تعديل العنوان"} onClose={close}>
                    <form onSubmit={save} noValidate className="space-y-4">
                        <fieldset>
                            <legend className="mb-1.5 text-sm font-semibold text-black">نوع العنوان</legend>
                            <div className="flex gap-2">
                                {ADDR_KIND.map((k) => (
                                    <label key={k.id} className="flex-1">
                                        <input type="radio" name="kind" value={k.id} defaultChecked={(current?.kind ?? "HOME") === k.id} className="peer sr-only" />
                                        <span className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/15 text-sm font-semibold text-black/70 transition-colors peer-checked:border-black peer-checked:bg-brand peer-checked:text-brand-soft peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                                            <k.icon size={15} aria-hidden />
                                            {k.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend className="mb-1.5 text-sm font-semibold text-black">الدولة</legend>
                            <div className="flex gap-2">
                                {REGION_IDS.map((id) => (
                                    <label key={id} className="flex-1">
                                        <input type="radio" name="country" value={id} checked={addrCountry === id} onChange={() => setAddrCountry(id)} className="peer sr-only" />
                                        <span className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/15 text-sm font-semibold text-black/70 transition-colors peer-checked:border-black peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                                            <Flag region={id} />
                                            {REGIONS[id].name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        <Field label="اسم العنوان" error={errors.label?.[0]}>
                            <input name="label" defaultValue={current?.label} placeholder="المنزل، المكتب…" className={inputCls} aria-invalid={!!errors.label || undefined} />
                        </Field>
                        <Field label="المدينة" error={errors.city?.[0]}>
                            <input name="city" defaultValue={current?.city} className={inputCls} aria-invalid={!!errors.city || undefined} />
                        </Field>
                        <Field label="العنوان بالتفصيل" error={errors.street?.[0]}>
                            <input name="street" defaultValue={current?.street} placeholder="الحي، الشارع، رقم المبنى" className={inputCls} aria-invalid={!!errors.street || undefined} />
                        </Field>
                        <Field label="رقم الجوال" error={errors.phone?.[0]}>
                            <input name="phone" type="tel" dir="ltr" defaultValue={current?.phone} placeholder={REGIONS[addrCountry].phoneExample} className={`${inputCls} text-right`} aria-invalid={!!errors.phone || undefined} />
                        </Field>
                        <label className="flex items-center gap-3 text-sm font-semibold text-black">
                            <input type="checkbox" name="isDefault" defaultChecked={current?.isDefault} className="h-5 w-5 accent-brand" />
                            اجعله عنوان التوصيل الافتراضي
                        </label>
                        <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>
                            {pending && <Loader2 size={16} className="animate-spin" />}
                            {editing === "new" ? "إضافة العنوان" : "حفظ التعديلات"}
                        </button>
                    </form>
                </Modal>
            )}

            {toDelete && (
                <Modal title="حذف العنوان" onClose={closeDelete}>
                    <p className="mb-5 text-black">سيتم حذف عنوان «{toDelete.label}» نهائيًا. هل تريد المتابعة؟</p>
                    <div className="flex gap-3">
                        <button disabled={pending} className={`${btnPrimary} flex-1 bg-rose-700! text-white! hover:bg-rose-800! hover:bg-none!`} onClick={confirmDelete}>
                            {pending && <Loader2 size={16} className="animate-spin" />}
                            حذف العنوان
                        </button>
                        <button className={`${btnGhost} flex-1`} onClick={closeDelete}>إلغاء</button>
                    </div>
                </Modal>
            )}
        </>
    );
}

function AccountTab({ user, onUpdateUser, notify }: { user: ProfileUser; onUpdateUser: (u: Partial<ProfileUser>) => void; notify: Notify }) {
    const { update } = useSession();
    const [info, setInfo] = useState({ name: user.name, phone: user.phone, birthday: user.birthday });
    const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
    const [infoErrors, setInfoErrors] = useState<FieldErrors>({});
    const [pwErrors, setPwErrors] = useState<FieldErrors>({});
    const [savingInfo, setSavingInfo] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const saveInfo = async (e: FormEvent) => {
        e.preventDefault();
        setSavingInfo(true);
        try {
            const res = await updateProfile(info);
            setInfoErrors(res.fieldErrors ?? {});
            if (report(res, notify)) {
                onUpdateUser(info);
                await update({ name: info.name });
            }
        } catch {
            notify({ type: "error", message: "حدث خطأ غير متوقع" });
        }
        setSavingInfo(false);
    };

    const savePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (pw.next !== pw.confirm) {
            setPwErrors({ confirm: ["كلمتا المرور غير متطابقتين"] });
            return;
        }
        setSavingPw(true);
        try {
            const res = await updatePassword({ currentPassword: pw.current, newPassword: pw.next });
            setPwErrors(res.fieldErrors ?? {});
            if (report(res, notify)) setPw({ current: "", next: "", confirm: "" });
        } catch {
            notify({ type: "error", message: "حدث خطأ غير متوقع" });
        }
        setSavingPw(false);
    };

    const card = "rounded-2xl border border-black/10 bg-white p-5 sm:p-6";
    const title = "mb-5 flex items-center gap-2 text-lg font-bold text-black";
    const icon = (I: typeof Mail) => <I size={16} className="text-brand-deep" />;

    return (
        <div className="space-y-6">
            {user.company && (
                <section className={card}>
                    <h3 className={title}><Building2 size={18} className="text-brand-deep" />بيانات المنشأة</h3>
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                        {[
                            ["اسم المنشأة", user.company.name],
                            ["نوع النشاط", user.company.businessType],
                            ["السجل التجاري", user.company.crNumber],
                            ["الرقم الضريبي", user.company.vatNumber ?? "غير مضاف"],
                            ["المدينة", user.company.city],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-xl bg-black/3 px-4 py-3">
                                <dt className="text-black/55">{k}</dt>
                                <dd className="mt-0.5 font-semibold text-black">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-4 text-sm text-black/55">لتعديل بيانات المنشأة تواصل مع فريق حسابات الشركات.</p>
                </section>
            )}

            <form onSubmit={saveInfo} noValidate className={card}>
                <h3 className={title}>{user.company ? "بيانات المسؤول" : "البيانات الشخصية"}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="الاسم الكامل" icon={icon(UserRound)} error={infoErrors.name?.[0]}>
                        <input className={inputCls} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} autoComplete="name" />
                    </Field>
                    <Field label="البريد الإلكتروني" icon={icon(Mail)}>
                        <input type="email" dir="ltr" className={`${inputCls} text-right`} value={user.email} disabled title="لا يمكن تعديل البريد الإلكتروني" />
                    </Field>
                    <Field label="رقم الجوال" icon={icon(Phone)} error={infoErrors.phone?.[0]}>
                        <input type="tel" dir="ltr" className={`${inputCls} text-right`} value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} placeholder="05XXXXXXXX" autoComplete="tel" />
                    </Field>
                    <Field label="تاريخ الميلاد" icon={icon(Gift)} error={infoErrors.birthday?.[0]}>
                        <input type="date" className={inputCls} value={info.birthday} onChange={(e) => setInfo({ ...info, birthday: e.target.value })} />
                    </Field>
                </div>
                <p className="mt-3 text-sm text-black/55">نستخدم تاريخ ميلادك لإرسال خصم خاص في شهر ميلادك.</p>
                <button type="submit" disabled={savingInfo} className={`${btnPrimary} mt-5`}>
                    {savingInfo && <Loader2 size={16} className="animate-spin" />}
                    {savingInfo ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                </button>
            </form>

            <form onSubmit={savePassword} noValidate className={card}>
                <h3 className={title}><Lock size={18} className="text-brand-deep" />الأمان وكلمة المرور</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="كلمة المرور الحالية" error={pwErrors.currentPassword?.[0]}>
                        <input type="password" autoComplete="current-password" className={inputCls} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
                    </Field>
                    <Field label="كلمة المرور الجديدة" error={pwErrors.newPassword?.[0]}>
                        <input type="password" autoComplete="new-password" className={inputCls} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                    </Field>
                    <Field label="تأكيد كلمة المرور" error={pwErrors.confirm?.[0]}>
                        <input type="password" autoComplete="new-password" className={inputCls} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                    </Field>
                </div>
                <button type="submit" disabled={savingPw} className={`${btnPrimary} mt-5`}>
                    {savingPw && <Loader2 size={16} className="animate-spin" />}
                    {savingPw ? "جارٍ التغيير..." : "تغيير كلمة المرور"}
                </button>
            </form>
        </div>
    );
}

function WishlistTab({ wishlist, notify }: { wishlist: ClientWishItem[]; notify: Notify }) {
    const [items, setItems] = useState(wishlist);

    const remove = async (w: ClientWishItem) => {
        setItems((s) => s.filter((x) => x !== w));
        try {
            const res = await removeFromWishlist(w.brand, w.productId);
            if (!report(res, notify)) setItems((s) => [w, ...s]);
        } catch {
            setItems((s) => [w, ...s]);
            notify({ type: "error", message: "حدث خطأ غير متوقع" });
        }
    };

    if (items.length === 0) return <EmptyState text="قائمة المفضلة فارغة. احفظ المنتجات التي تعجبك لتجدها هنا." />;

    return (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
                <article key={`${p.brand}-${p.productId}`} className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-colors hover:border-brand/60">
                    <div className="relative aspect-4/3 bg-[#fef8eb]">
                        {p.image && <Image src={p.image} alt={p.name} fill sizes="(min-width:1280px) 25vw, (min-width:480px) 40vw, 90vw" className="object-cover" />}
                        <button
                            onClick={() => remove(p)}
                            aria-label={`إزالة ${p.name} من المفضلة`}
                            className="absolute inset-e-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-600 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                            <Heart size={18} fill="currentColor" />
                        </button>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-black"><Link href={p.href} className="hover:text-brand-deep">{p.name}</Link></h3>
                        <p className="text-sm text-black/55">{p.note}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="font-bold text-black"><Price product={p} /></span>
                            <button
                                onClick={() => addToCart(p.brand, p.productId, 1) && notify({ type: "success", message: `أُضيف «${p.name}» إلى السلة` })}
                                className={`${btnPrimary} px-4! py-2! text-sm`}
                            >
                                <ShoppingBag size={15} />أضف للسلة
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default function ProfileClient({
    initialTab,
    initialUser,
    initialOrders,
    initialAddresses,
    initialWishlist,
}: {
    initialTab: TabId;
    initialUser: ProfileUser;
    initialOrders: ClientOrder[];
    initialAddresses: ClientAddress[];
    initialWishlist: ClientWishItem[];
}) {
    const [user, setUser] = useState(initialUser);
    const [tab, setTab] = useState<TabId>(initialTab);
    const [drawer, setDrawer] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const clearToast = useCallback(() => setToast(null), []);

    const active = TABS.find((t) => t.id === tab)!;
    const choose = (id: TabId) => {
        setTab(id);
        setDrawer(false);
        window.history.replaceState(null, "", id === "orders" ? "/profile" : `/profile?tab=${id}`);
    };

    const navBtn = "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-start font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

    const nav = (
        <nav aria-label="أقسام الحساب" className="space-y-1.5">
            {TABS.map(({ id, label, icon: Icon }) => {
                const on = id === tab;
                return (
                    <button
                        key={id}
                        onClick={() => choose(id)}
                        aria-current={on ? "page" : undefined}
                        className={`${navBtn} ${on ? "bg-brand text-white shadow-md" : "text-black hover:bg-brand/10"}`}
                    >
                        <Icon size={19} className={on ? "text-brand-soft" : "text-brand-deep"} />
                        {label}
                    </button>
                );
            })}
            <button onClick={() => signOut({ redirectTo: "/" })} className={`${navBtn} mt-2 border-t border-black/10 pt-4 text-black/60 hover:text-rose-700`}>
                <LogOut size={19} />
                تسجيل الخروج
            </button>
        </nav>
    );

    return (
        <main dir="rtl" lang="ar" className="min-h-screen bg-[#fdfaf3] text-black">
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
                <ProfileHeader user={user} />

                <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
                    <aside className="hidden h-fit rounded-3xl border border-brand/30 bg-white p-3 lg:sticky lg:top-32 lg:block">{nav}</aside>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setDrawer(true)}
                            aria-haspopup="dialog"
                            aria-expanded={drawer}
                            className="flex w-full items-center justify-between rounded-2xl border border-brand/40 bg-white px-4 py-3.5 font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                            <span className="flex items-center gap-3"><active.icon size={19} className="text-brand-deep" />{active.label}</span>
                            <Menu size={20} />
                        </button>
                    </div>

                    <section aria-labelledby="tab-title" className="min-w-0 lg:col-start-2 lg:row-start-1">
                        <h2 id="tab-title" className="mb-5 hidden text-2xl font-semibold text-black lg:block">{active.label}</h2>
                        <div key={tab} className="animate-fade-up">
                            {tab === "orders" && <OrdersTab orders={initialOrders} notify={setToast} />}
                            {tab === "addresses" && <AddressesTab addresses={initialAddresses} notify={setToast} />}
                            {tab === "account" && <AccountTab user={user} onUpdateUser={(u) => setUser((prev) => ({ ...prev, ...u }))} notify={setToast} />}
                            {tab === "wishlist" && <WishlistTab wishlist={initialWishlist} notify={setToast} />}
                        </div>
                    </section>
                </div>
            </div>

            {drawer && (
                <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="أقسام الحساب">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
                    <div className="absolute inset-y-0 inset-s-0 w-72 max-w-[85%] border-e border-brand/30 bg-white p-4 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-bold text-black">حسابي</span>
                            <button onClick={() => setDrawer(false)} aria-label="إغلاق القائمة" className="rounded-full p-2 hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"><X size={20} /></button>
                        </div>
                        {nav}
                    </div>
                </div>
            )}

            <Toast toast={toast} onDone={clearToast} />
        </main>
    );
}

"use client";

import { useId, useState } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    AlertCircle, BadgePercent, Briefcase, Building2, Coffee, Eye, EyeOff, FileText,
    Gift, Loader2, Lock, Mail, Phone, Repeat, Star, Truck, UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { registerBusiness, registerIndividual } from "@/actions/auth-actions";
import { goldFill } from "@/components/theme";
import { BUSINESS_TYPES, businessSchema, fieldErrorsOf, individualSchema, loginSchema } from "@/lib/validation";
import type { FieldErrors } from "@/lib/validation";

export type AuthView = "login" | "individual" | "business";

const PANEL: Record<AuthView, { title: string; text: string; perks: { icon: LucideIcon; text: string }[] }> = {
    login: {
        title: "أهلاً بعودتك",
        text: "سجّل دخولك لمتابعة طلباتك والوصول إلى عناوينك ومفضلتك بسرعة.",
        perks: [
            { icon: Repeat, text: "أعد طلباتك السابقة بضغطة واحدة" },
            { icon: Star, text: "نقاط مع كل طلب ومستويات عضوية" },
            { icon: Truck, text: "تابع حالة التوصيل أول بأول" },
        ],
    },
    individual: {
        title: "انضم لعائلة RNQ",
        text: "حساب واحد لقهوة بارنيز وحلويات سعد الدين.",
        perks: [
            { icon: Coffee, text: "قهوة مختصة وحلويات فاخرة في سلة واحدة" },
            { icon: Gift, text: "خصم خاص في شهر ميلادك" },
            { icon: Star, text: "اجمع نقاط وارتقِ في مستويات العضوية" },
        ],
    },
    business: {
        title: "حساب الشركات",
        text: "للفنادق والمقاهي والشركات: توريد منتظم بأسعار خاصة.",
        perks: [
            { icon: BadgePercent, text: "أسعار جملة حسب الكميات" },
            { icon: Repeat, text: "طلبات متكررة وجدولة للتوريد" },
            { icon: FileText, text: "فواتير ضريبية باسم المنشأة" },
            { icon: Briefcase, text: "مسؤول حساب يتابع معك" },
        ],
    },
};

const inputCls =
    "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-black placeholder:text-black/35 outline-none transition " +
    "focus:border-gold focus:ring-2 focus:ring-gold/40 aria-invalid:border-rose-500 aria-invalid:ring-rose-200";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    icon?: LucideIcon;
    errors?: string[];
    hint?: string;
    inputClassName?: string;
}

function Field({ label, name, icon: Icon, errors, hint, className = "", inputClassName = "", ...rest }: FieldProps) {
    const id = useId();
    const err = errors?.[0];
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-black">
                {Icon && <Icon size={15} className="text-gold-deep" aria-hidden />}
                {label}
            </label>
            <input
                id={id}
                name={name}
                aria-invalid={err ? true : undefined}
                aria-describedby={err ? `${id}-err` : hint ? `${id}-hint` : undefined}
                className={`${inputCls} ${inputClassName}`}
                {...rest}
            />
            {err ? (
                <p id={`${id}-err`} className="mt-1.5 text-xs font-semibold text-rose-700">{err}</p>
            ) : (
                hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-black/50">{hint}</p>
            )}
        </div>
    );
}

function PasswordField(props: Omit<FieldProps, "type">) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <Field {...props} type={show ? "text" : "password"} inputClassName="pe-12" />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute inset-e-2 top-8 flex h-9 w-9 items-center justify-center rounded-lg text-black/50 transition-colors hover:text-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
                {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
        </div>
    );
}

function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-bold text-black transition-shadow duration-500 hover:shadow-[0_0_40px_-6px_rgba(212,175,55,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            style={{ backgroundImage: goldFill }}
        >
            {pending && <Loader2 size={18} className="animate-spin" aria-hidden />}
            {children}
        </button>
    );
}

function FormError({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 ring-1 ring-rose-200">
            <AlertCircle size={18} aria-hidden className="shrink-0" />
            {message}
        </p>
    );
}

interface FormProps {
    onDone: () => void;
}

const values = (e: FormEvent<HTMLFormElement>) => Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

function useFormState() {
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    return { pending, setPending, errors, setErrors, formError, setFormError };
}

async function signInWith(email: string, password: string) {
    const res = await signIn("credentials", { email, password, redirect: false });
    return !res?.error;
}

function LoginForm({ onDone }: FormProps) {
    const s = useFormState();

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const raw = values(e);
        const parsed = loginSchema.safeParse(raw);
        s.setFormError(null);
        if (!parsed.success) return s.setErrors(fieldErrorsOf(parsed.error));
        s.setErrors({});

        s.setPending(true);
        try {
            if (await signInWith(parsed.data.email, parsed.data.password)) return onDone();
            s.setFormError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } catch {
            s.setFormError("تعذّر الاتصال، حاول مرة أخرى");
        }
        s.setPending(false);
    };

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            <FormError message={s.formError} />
            <Field label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" icon={Mail} errors={s.errors.email} />
            <PasswordField label="كلمة المرور" name="password" autoComplete="current-password" icon={Lock} errors={s.errors.password} />
            <SubmitButton pending={s.pending}>تسجيل الدخول</SubmitButton>
        </form>
    );
}

function IndividualForm({ onDone }: FormProps) {
    const s = useFormState();

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const raw = values(e);
        s.setFormError(null);
        const parsed = individualSchema.safeParse(raw);
        if (!parsed.success) return s.setErrors(fieldErrorsOf(parsed.error));
        s.setErrors({});

        s.setPending(true);
        try {
            const res = await registerIndividual(raw);
            if (res.success && (await signInWith(parsed.data.email, raw.password))) return onDone();
            s.setErrors(res.fieldErrors ?? {});
            s.setFormError(res.error ?? (res.success ? "تم إنشاء الحساب، سجّل الدخول من تبويب تسجيل الدخول" : null));
        } catch {
            s.setFormError("تعذّر الاتصال، حاول مرة أخرى");
        }
        s.setPending(false);
    };

    return (
        <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><FormError message={s.formError} /></div>
            <Field label="الاسم الكامل" name="name" autoComplete="name" icon={UserRound} errors={s.errors.name} className="sm:col-span-2" />
            <Field label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" icon={Mail} errors={s.errors.email} />
            <Field label="رقم الجوال" name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="05XXXXXXXX" icon={Phone} errors={s.errors.phone} />
            <PasswordField label="كلمة المرور" name="password" autoComplete="new-password" icon={Lock} errors={s.errors.password} hint="8 أحرف على الأقل" />
            <PasswordField label="تأكيد كلمة المرور" name="confirm" autoComplete="new-password" icon={Lock} errors={s.errors.confirm} />
            <div className="sm:col-span-2"><SubmitButton pending={s.pending}>إنشاء الحساب</SubmitButton></div>
        </form>
    );
}

function BusinessForm({ onDone }: FormProps) {
    const s = useFormState();
    const typeId = useId();

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fields = values(e);
        const raw = { ...fields, terms: fields.terms === "on" };
        s.setFormError(null);
        const parsed = businessSchema.safeParse(raw);
        if (!parsed.success) return s.setErrors(fieldErrorsOf(parsed.error));
        s.setErrors({});

        s.setPending(true);
        try {
            const res = await registerBusiness(raw);
            if (res.success && (await signInWith(parsed.data.email, fields.password))) return onDone();
            s.setErrors(res.fieldErrors ?? {});
            s.setFormError(res.error ?? (res.success ? "تم إرسال الطلب، سجّل الدخول من تبويب تسجيل الدخول" : null));
        } catch {
            s.setFormError("تعذّر الاتصال، حاول مرة أخرى");
        }
        s.setPending(false);
    };

    const legend = "mb-4 flex items-center gap-2 text-sm font-bold text-gold-deep";

    return (
        <form onSubmit={submit} noValidate className="space-y-6">
            <FormError message={s.formError} />

            <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className={legend}><Building2 size={16} aria-hidden />بيانات المنشأة</legend>
                <Field label="اسم المنشأة" name="companyName" autoComplete="organization" errors={s.errors.companyName} className="sm:col-span-2" />
                <Field label="رقم السجل التجاري" name="crNumber" inputMode="numeric" dir="ltr" maxLength={10} errors={s.errors.crNumber} />
                <Field label="الرقم الضريبي (اختياري)" name="vatNumber" inputMode="numeric" dir="ltr" maxLength={15} errors={s.errors.vatNumber} />
                <div>
                    <label htmlFor={typeId} className="mb-1.5 block text-sm font-semibold text-black">نوع النشاط</label>
                    <select
                        id={typeId}
                        name="businessType"
                        defaultValue=""
                        aria-invalid={s.errors.businessType ? true : undefined}
                        className={inputCls}
                    >
                        <option value="" disabled>اختر</option>
                        {BUSINESS_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                    {s.errors.businessType && <p className="mt-1.5 text-xs font-semibold text-rose-700">{s.errors.businessType[0]}</p>}
                </div>
                <Field label="المدينة" name="city" autoComplete="address-level2" errors={s.errors.city} />
            </fieldset>

            <fieldset className="grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-2">
                <legend className={`${legend} float-start w-full`}><UserRound size={16} aria-hidden />بيانات المسؤول</legend>
                <Field label="الاسم الكامل" name="name" autoComplete="name" errors={s.errors.name} className="sm:col-span-2" />
                <Field label="البريد الإلكتروني للعمل" name="email" type="email" dir="ltr" autoComplete="email" icon={Mail} errors={s.errors.email} />
                <Field label="رقم الجوال" name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="05XXXXXXXX" icon={Phone} errors={s.errors.phone} />
                <PasswordField label="كلمة المرور" name="password" autoComplete="new-password" icon={Lock} errors={s.errors.password} hint="8 أحرف على الأقل" />
                <PasswordField label="تأكيد كلمة المرور" name="confirm" autoComplete="new-password" icon={Lock} errors={s.errors.confirm} />
            </fieldset>

            <div>
                <label className="flex items-start gap-3 text-sm text-black/75">
                    <input type="checkbox" name="terms" className="mt-0.5 h-5 w-5 shrink-0 accent-gold" />
                    <span>
                        أوافق على{" "}
                        <Link href="/legal/terms" target="_blank" className="font-semibold text-gold-deep underline-offset-4 hover:underline">الشروط والأحكام</Link>
                        {" "}و{" "}
                        <Link href="/legal/privacy" target="_blank" className="font-semibold text-gold-deep underline-offset-4 hover:underline">سياسة الخصوصية</Link>
                    </span>
                </label>
                {s.errors.terms && <p className="mt-1.5 text-xs font-semibold text-rose-700">{s.errors.terms[0]}</p>}
            </div>

            <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm leading-relaxed text-black/70 ring-1 ring-gold/30">
                سنراجع بيانات المنشأة خلال يوم عمل. يمكنك الدخول إلى حسابك مباشرة، وتُفعّل أسعار الجملة بعد الموافقة.
            </p>

            <SubmitButton pending={s.pending}>إرسال طلب حساب الشركة</SubmitButton>
        </form>
    );
}

function Segmented<T extends string>({
    label,
    value,
    options,
    onChange,
    dark = false,
}: {
    label: string;
    value: T;
    options: { id: T; label: string }[];
    onChange: (v: T) => void;
    dark?: boolean;
}) {
    return (
        <div role="group" aria-label={label} className={`inline-flex w-full rounded-full border p-1 ${dark ? "border-black/10 bg-black/4" : "border-gold/30 bg-white"}`}>
            {options.map((o) => {
                const active = o.id === value;
                return (
                    <button
                        key={o.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange(o.id)}
                        className={`min-h-11 flex-1 rounded-full px-4 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${active ? (dark ? "bg-black text-gold-soft shadow" : "text-black shadow") : "text-black/55 hover:text-black"}`}
                        style={active && !dark ? { backgroundImage: goldFill } : undefined}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

export default function AuthClient({ initialView, callbackUrl }: { initialView: AuthView; callbackUrl: string }) {
    const router = useRouter();
    const [view, setView] = useState<AuthView>(initialView);
    const panel = PANEL[view];
    const mode = view === "login" ? "login" : "register";

    const go = (v: AuthView) => {
        setView(v);
        const q = v === "login" ? "" : `?mode=register${v === "business" ? "&type=business" : ""}`;
        window.history.replaceState(null, "", `/auth${q}`);
    };

    const done = () => {
        router.replace(callbackUrl);
        router.refresh();
    };

    return (
        <main dir="rtl" lang="ar" className="bg-[#faf7ef] px-4 py-10 sm:py-16">
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-gold/30 bg-white shadow-[0_30px_80px_-40px_rgba(138,106,31,0.45)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <aside className="relative isolate overflow-hidden bg-linear-to-bl from-[#1c170b] via-black to-black p-8 text-white sm:p-10 lg:p-12">
                    <div aria-hidden className="pointer-events-none absolute -inset-s-20 -top-24 -z-10 h-80 w-80 animate-float rounded-full bg-gold/25 blur-3xl motion-reduce:animate-none" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-28 inset-e-0 -z-10 h-72 w-72 animate-float-slow rounded-full bg-gold/15 blur-3xl motion-reduce:animate-none" />
                    <span aria-hidden className="pointer-events-none absolute -bottom-8 inset-s-4 -z-10 select-none text-[8rem] font-black leading-none text-gold/[0.07] sm:text-[11rem]">
                        RNQ
                    </span>

                    <div key={view} className="flex h-full flex-col">
                        <p className="animate-fade-up text-sm font-semibold text-gold-soft/80">مجموعة RNQ للتجارة</p>
                        <h1 className="mt-3 animate-fade-up text-3xl font-semibold leading-tight [animation-delay:60ms] sm:text-4xl">{panel.title}</h1>
                        <span aria-hidden className="mt-5 block h-px w-32 animate-fade-up [animation-delay:100ms]" style={{ backgroundImage: "linear-gradient(90deg,#d4af37,transparent)" }} />
                        <p className="mt-5 max-w-sm animate-fade-up leading-loose text-white/70 [animation-delay:120ms]">{panel.text}</p>

                        <ul className="mt-8 hidden space-y-4 sm:block">
                            {panel.perks.map(({ icon: Icon, text }, i) => (
                                <li key={text} className="flex animate-fade-up items-center gap-3" style={{ animationDelay: `${180 + i * 80}ms` }}>
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-white/5 text-gold">
                                        <Icon size={18} aria-hidden />
                                    </span>
                                    <span className="text-sm text-white/85">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <section aria-label={mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"} className="p-6 sm:p-10 lg:p-12">
                    <Segmented
                        label="الدخول أو إنشاء حساب"
                        value={mode}
                        dark
                        options={[
                            { id: "login", label: "تسجيل الدخول" },
                            { id: "register", label: "حساب جديد" },
                        ]}
                        onChange={(m) => go(m === "login" ? "login" : "individual")}
                    />

                    {mode === "register" && (
                        <div className="mt-4 animate-fade-up">
                            <Segmented
                                label="نوع الحساب"
                                value={view as "individual" | "business"}
                                options={[
                                    { id: "individual", label: "للأفراد" },
                                    { id: "business", label: "للشركات" },
                                ]}
                                onChange={go}
                            />
                        </div>
                    )}

                    <div key={view} className="mt-8 animate-fade-up">
                        {view === "login" && <LoginForm onDone={done} />}
                        {view === "individual" && <IndividualForm onDone={done} />}
                        {view === "business" && <BusinessForm onDone={done} />}
                    </div>

                    <p className="mt-6 text-center text-sm text-black/60">
                        {view === "login" ? (
                            <>
                                ليس لديك حساب؟{" "}
                                <button type="button" onClick={() => go("individual")} className="font-bold text-gold-deep underline-offset-4 hover:underline focus:outline-none focus-visible:underline">
                                    أنشئ حسابًا جديدًا
                                </button>
                            </>
                        ) : (
                            <>
                                لديك حساب؟{" "}
                                <button type="button" onClick={() => go("login")} className="font-bold text-gold-deep underline-offset-4 hover:underline focus:outline-none focus-visible:underline">
                                    سجّل الدخول
                                </button>
                            </>
                        )}
                    </p>
                </section>
            </div>
        </main>
    );
}

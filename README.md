# RNQ: موقع مجموعة RNQ للتجارة

متجر قهوة بارنيز وحلويات سعد الدين، للأفراد وللشركات.

**التقنيات:** Next.js 16 (App Router + Turbopack)، React 19، Tailwind CSS 4، Auth.js v5، Prisma 7، PostgreSQL (Neon).

## التشغيل لأول مرة

```bash
npm install
cp .env.example .env        # واملأ القيم (شوف تحت)
npm run db:deploy           # يعمل جداول قاعدة البيانات
npm run dev                 # http://localhost:3000
```

### متغيرات `.env`

| المتغير | الوصف |
|---|---|
| `DATABASE_URL` | رابط قاعدة البيانات اللي الموقع بيستخدمه (في Neon: الرابط اللي فيه `-pooler`) |
| `DIRECT_URL` | الاتصال المباشر للـ migrations (نفس الرابط من غير `-pooler`) |
| `AUTH_SECRET` | مفتاح تشفير الجلسات: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع، بيستخدم في JSON-LD (اختياري) |

## الأوامر

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل وقت التطوير |
| `npm run build` / `npm start` | بناء وتشغيل نسخة الإنتاج |
| `npm run lint` | فحص الكود |
| `npm run db:migrate` | عمل migration جديدة بعد تعديل `prisma/schema.prisma` |
| `npm run db:deploy` | تطبيق الـ migrations على القاعدة (الإنتاج) |
| `npm run db:studio` | فتح Prisma Studio (مثلاً للموافقة على حسابات الشركات) |

## هيكل المشروع

```
src/
  app/
    page.tsx                      الرئيسية
    products/                     كل المنتجات، صفحة البراند، صفحة المنتج
    @modal/(.)products/...        نافذة المعاينة السريعة للمنتج
    auth/                         الدخول والتسجيل (أفراد + شركات)
    profile/                      حسابي
    legal/                        الشروط والخصوصية والشحن والاسترجاع
    api/auth/[...nextauth]/       Auth.js
  actions/                        Server Actions (التسجيل، الحساب، العناوين...)
  components/
    brands.ts                     البراندات والمنتجات (بيانات ثابتة حالياً)
    theme.ts                      ألوان الهوية الدهبي
  lib/                            قاعدة البيانات، التحقق (zod)، أنواع صفحة الحساب
  auth.ts                         إعدادات Auth.js
prisma/                           schema + migrations
```

## حسابات الشركات

التسجيل بيعمل الحساب بحالة `PENDING`. للموافقة: `npm run db:studio` ← جدول `Company` ← غيّر `status` لـ `APPROVED`.

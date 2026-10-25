

export type BrandId = "barns" | "saadeddin";

export interface BrandCategory {
    /** نفس قيم ?type= في روابط النافبار (beans, ground, tools, dates, sweets, gifts) */
    id: string;
    label: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    /** لازم يطابق id من categories بتاعة البراند */
    category: string;
    price: number;
    /** مسار صورة من فولدر public. لو مفيش، بيظهر شكل بديل بالعلامة */
    image?: string;
    badge?: string;
    href?: string;
    /** جزء من الرابط، يفضل إنجليزي بشرطات (مثال: ethiopia-yirgacheffe). لو مفيش بنستخدم id */
    slug?: string;
    /** وصف مفصل يظهر في صفحة المنتج ونافذته */
    details?: string;
    /** صور المعرض (الأولى هي الرئيسية). لو مفيش بنستخدم image */
    images?: string[];
    /** مواصفات: الوزن، المنشأ، درجة التحميص... */
    specs?: { label: string; value: string }[];
}

export interface BrandConfig {
    id: BrandId;
    title: string;
    blurb: string;
    /** حرف بيظهر في مكان الصورة لو المنتج مالوش صورة */
    mark: string;
    tinted: boolean;
    categories: BrandCategory[];
}

/* ------------------------------------------------------------------ */
/* Brands + placeholder products (replace with real data)              */
/* ------------------------------------------------------------------ */

export const BRANDS: Record<BrandId, BrandConfig> = {
    barns: {
        id: "barns",
        title: "قهوة بارنيز",
        blurb: "قهوة سعودية مختصة، تُحمّص طازجة وتصلك من الرياض.",
        mark: "B",
        tinted: false,
        categories: [
            { id: "beans", label: "حبوب القهوة" },
            { id: "ground", label: "القهوة المطحونة" },
            { id: "tools", label: "أدوات التحضير" },
        ],
    },
    saadeddin: {
        id: "saadeddin",
        title: "حلويات سعد الدين",
        blurb: "تمور وحلويات شرقية بصناعة يدوية منذ عام 1919.",
        mark: "س",
        tinted: true,
        categories: [
            { id: "dates", label: "التمور" },
            { id: "sweets", label: "الحلويات الشرقية" },
            { id: "cakes", label: "الكيكات" },
            { id: "gifts", label: "علب الهدايا" },
        ],
    },
};

/** بيانات تجريبية: استبدلها بمنتجاتك الحقيقية (من API أو CMS) وابعتها في prop اسمه products */
export const SAMPLE_PRODUCTS: Record<BrandId, Product[]> = {
    barns: [
        { id: "b1", category: "beans", name: "حبوب إثيوبيا يرقاشيف", description: "نكهات زهرية وحمضيات، 250 جم", price: 95, image: "/images/products/ethubiacoffe.jpg" },
        { id: "b2", category: "beans", name: "حبوب كولومبيا سوبريمو", description: "حلاوة الكراميل والمكسرات، 250 جم", price: 82, image: "/images/products/colombiacoffe.jpg" },
        { id: "b3", category: "beans", name: "مزيج بارنيز الخاص", description: "بوكس السفر بحجم 1 لتر", price: 110, badge: "الأكثر طلباً", image: "/images/products/barnscoffe.png" },
        { id: "b4", category: "ground", name: "موكا", description: "قهوة إسبريسو بنكهة الشوكولاتة مع حليب كريمي مغطى بمسحوق الكاكاو", price: 78, image: "/images/products/mocha.jpg" },
        { id: "b5", category: "ground", name: "الإسبريسو", description: "قهوة قوية ومركّزة بنكهة غنية وعميقة", price: 88, image: "/images/products/essbreso.jpg" },
        { id: "b6", category: "ground", name: "قهوة سعودية بالهيل", description: "قهوة سعودية تقليدية بالهيل، تُغلى في الماء", price: 70, image: "/images/products/saudicoffe.jpg" },
        { id: "b7", category: "ground", name: "قهوة تركية", description: "قهوة فاخرة محمّصة جيدًا، تُغلى في الماء لتمنحك نكهة القهوة الطبيعية", price: 70, image: "/images/products/turkish.jpg" },
    ],
    saadeddin: [
        { id: "s1", category: "dates", name: "تمر سكري فاخر", description: "طري ومنتقى، 1 كجم", price: 65, image: "/images/products/tamr1.webp" },
        { id: "s2", category: "dates", name: "تمر عجوة المدينة", description: "من مزارع المدينة المنورة، 1 كجم", price: 90, image: "/images/products/tamr2.webp" },
        { id: "s3", category: "dates", name: "تمر مجدول", description: "حبات كبيرة، 1 كجم", price: 120, badge: "الأكثر طلباً", image: "/images/products/tamr3.webp" },
        { id: "s4", category: "cakes", name: "تشيز كيك التوت الأزرق", description: "علبة 500 جم", price: 85, image: "/images/products/blueberrycheesecake.jpeg" },
        { id: "s5", category: "cakes", name: "تشيز كيك التوت الأحمر", description: "علبة 500 جم", price: 85, image: "/images/products/redberrycheesecake.jpeg" },
        { id: "s6", category: "cakes", name: "تشيز كيك اللوتس", description: "علبة 500 جم", price: 85, image: "/images/products/lotuscake.jpeg" },
        { id: "s7", category: "cakes", name: "كيك روشيه صغيرة", description: "علبة 500 جم", price: 85, image: "/images/products/rochercake.jpeg" },
        { id: "s8", category: "cakes", name: "كيك سنيكرز صغيرة", description: "علبة 500 جم", price: 85, image: "/images/products/snickerscake.jpeg" },
        { id: "s9", category: "sweets", name: "معمول بالتمر", description: "علبة 24 قطعة", price: 55, image: "/images/products/mamoultamr.webp" },
        { id: "s10", category: "sweets", name: "حلاوة طحينية بالفستق", description: "علبة 400 جم", price: 60, image: "/images/products/halawa.webp" },
        { id: "s11", category: "gifts", name: "علبة هدايا ذهبية", description: "تمور وحلويات مختارة", price: 220, image: "/images/products/tamrbox.webp" },
        { id: "s12", category: "gifts", name: "علبة تمور ومعمول", description: "تغليف مناسب للمناسبات", price: 160, image: "/images/products/mamoul.webp" },
    ],
};

/* ------------------------------------------------------------------ */
/* Helpers: روابط المنتجات والبحث عنها                                  */
/* ------------------------------------------------------------------ */

export const formatPrice = (n: number) => `${n.toLocaleString("en-US")} ر.س`;

export const isBrandId = (v: string): v is BrandId => Object.prototype.hasOwnProperty.call(BRANDS, v);

/** الجزء الأخير من رابط المنتج */
export const productKey = (p: Product) => p.slug ?? p.id;

export const productPath = (brand: BrandId, p: Product) => `/products/${brand}/${productKey(p)}`;

export const findProduct = (brand: BrandId, key: string) =>
    SAMPLE_PRODUCTS[brand].find((p) => productKey(p) === key);

/** كل توليفات البراند/المنتج، للتوليد الثابت وقت الـ build */
export const productStaticParams = () =>
    (Object.keys(SAMPLE_PRODUCTS) as BrandId[]).flatMap((brand) =>
        SAMPLE_PRODUCTS[brand].map((p) => ({ brand, productId: productKey(p) }))
    );

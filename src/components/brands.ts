import { DEFAULT_REGION, formatMoney } from "@/lib/regions";
import type { RegionId } from "@/lib/regions";

export type BrandId = "barns" | "saadeddin";

export interface BrandCategory {
    id: string;
    label: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    priceEg: number;
    image?: string;
    badge?: string;
    href?: string;
    slug?: string;
    details?: string;
    images?: string[];
    specs?: { label: string; value: string }[];
}

export interface BrandConfig {
    id: BrandId;
    title: string;
    blurb: string;
    mark: string;
    tinted: boolean;
    categories: BrandCategory[];
}

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

export const SAMPLE_PRODUCTS: Record<BrandId, Product[]> = {
    barns: [
        { id: "b1", slug: "ethiopia-yirgacheffe-beans", category: "beans", name: "حبوب إثيوبيا يرقاشيف", description: "نكهات زهرية وحمضيات، 250 جم", price: 95, priceEg: 1250, image: "/images/products/ethubiacoffe.jpg" },
        { id: "b2", slug: "colombia-supremo-beans", category: "beans", name: "حبوب كولومبيا سوبريمو", description: "حلاوة الكراميل والمكسرات، 250 جم", price: 82, priceEg: 1050, image: "/images/products/colombiacoffe.jpg" },
        { id: "b3", slug: "barns-signature-blend", category: "beans", name: "مزيج بارنيز الخاص", description: "بوكس السفر بحجم 1 لتر", price: 110, priceEg: 1450, badge: "الأكثر طلباً", image: "/images/products/barnscoffe.png" },
        { id: "b4", slug: "mocha", category: "ground", name: "موكا", description: "قهوة إسبريسو بنكهة الشوكولاتة مع حليب كريمي مغطى بمسحوق الكاكاو", price: 78, priceEg: 1000, image: "/images/products/mocha.jpg" },
        { id: "b5", slug: "espresso", category: "ground", name: "الإسبريسو", description: "قهوة قوية ومركّزة بنكهة غنية وعميقة", price: 88, priceEg: 1150, image: "/images/products/essbreso.jpg" },
        { id: "b6", slug: "saudi-coffee-cardamom", category: "ground", name: "قهوة سعودية بالهيل", description: "قهوة سعودية تقليدية بالهيل، تُغلى في الماء", price: 70, priceEg: 900, image: "/images/products/saudicoffe.jpg" },
        { id: "b7", slug: "turkish-coffee", category: "ground", name: "قهوة تركية", description: "قهوة فاخرة محمّصة جيدًا، تُغلى في الماء لتمنحك نكهة القهوة الطبيعية", price: 70, priceEg: 950, image: "/images/products/turkish.jpg" },
    ],
    saadeddin: [
        { id: "s1", slug: "sukkari-dates", category: "dates", name: "تمر سكري فاخر", description: "طري ومنتقى، 1 كجم", price: 65, priceEg: 850, image: "/images/products/tamr1.webp" },
        { id: "s2", slug: "ajwa-madinah-dates", category: "dates", name: "تمر عجوة المدينة", description: "من مزارع المدينة المنورة، 1 كجم", price: 90, priceEg: 1150, image: "/images/products/tamr2.webp" },
        { id: "s3", slug: "medjool-dates", category: "dates", name: "تمر مجدول", description: "حبات كبيرة، 1 كجم", price: 120, priceEg: 1550, badge: "الأكثر طلباً", image: "/images/products/tamr3.webp" },
        { id: "s4", slug: "blueberry-cheesecake", category: "cakes", name: "تشيز كيك التوت الأزرق", description: "علبة 500 جم", price: 85, priceEg: 1100, image: "/images/products/blueberrycheesecake.jpeg" },
        { id: "s5", slug: "red-berry-cheesecake", category: "cakes", name: "تشيز كيك التوت الأحمر", description: "علبة 500 جم", price: 85, priceEg: 1100, image: "/images/products/redberrycheesecake.jpeg" },
        { id: "s6", slug: "lotus-cheesecake", category: "cakes", name: "تشيز كيك اللوتس", description: "علبة 500 جم", price: 85, priceEg: 1100, image: "/images/products/lotuscake.jpeg" },
        { id: "s7", slug: "mini-rocher-cake", category: "cakes", name: "كيك روشيه صغيرة", description: "علبة 500 جم", price: 85, priceEg: 1100, image: "/images/products/rochercake.jpeg" },
        { id: "s8", slug: "mini-snickers-cake", category: "cakes", name: "كيك سنيكرز صغيرة", description: "علبة 500 جم", price: 85, priceEg: 1100, image: "/images/products/snickerscake.jpeg" },
        { id: "s9", slug: "date-maamoul", category: "sweets", name: "معمول بالتمر", description: "علبة 24 قطعة", price: 55, priceEg: 700, image: "/images/products/mamoultamr.webp" },
        { id: "s10", slug: "pistachio-halawa", category: "sweets", name: "حلاوة طحينية بالفستق", description: "علبة 400 جم", price: 60, priceEg: 780, image: "/images/products/halawa.webp" },
        { id: "s11", slug: "golden-gift-box", category: "gifts", name: "علبة هدايا ذهبية", description: "تمور وحلويات مختارة", price: 220, priceEg: 2850, image: "/images/products/tamrbox.webp" },
        { id: "s12", slug: "dates-maamoul-box", category: "gifts", name: "علبة تمور ومعمول", description: "تغليف مناسب للمناسبات", price: 160, priceEg: 2100, image: "/images/products/mamoul.webp" },
    ],
};

export const formatPrice = formatMoney;

export const priceOf = (p: Pick<Product, "price" | "priceEg">, region: RegionId = DEFAULT_REGION) => (region === "EG" ? p.priceEg : p.price);

export const isBrandId = (v: string): v is BrandId => Object.prototype.hasOwnProperty.call(BRANDS, v);

export const productKey = (p: Product) => p.slug ?? p.id;

export const productPath = (brand: BrandId, p: Product) => `/products/${brand}/${productKey(p)}`;

export const findProduct = (brand: BrandId, key: string) =>
    SAMPLE_PRODUCTS[brand].find((p) => productKey(p) === key);

export const productStaticParams = () =>
    (Object.keys(SAMPLE_PRODUCTS) as BrandId[]).flatMap((brand) =>
        SAMPLE_PRODUCTS[brand].map((p) => ({ brand, productId: productKey(p) }))
    );

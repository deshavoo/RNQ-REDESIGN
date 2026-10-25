import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { QuickViewModal } from "@/components/ProductClient";
import { findProduct, isBrandId, productStaticParams } from "@/components/brands";

export const dynamicParams = false;

export function generateStaticParams() {
    return productStaticParams();
}

export default async function QuickViewPage({ params }: { params: Promise<{ brand: string; productId: string }> }) {
    const { brand, productId } = await params;
    if (!isBrandId(brand)) notFound();
    const product = findProduct(brand, productId);
    if (!product) notFound();

    return (
        <QuickViewModal labelledBy="product-title">
            <ProductDetails brandId={brand} product={product} variant="modal" />
        </QuickViewModal>
    );
}

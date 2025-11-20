import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductForm from "../_components/product-form";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await db.query.products.findFirst({
        where: eq(products.id, parseInt(id)),
    });

    if (!product) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>
            <ProductForm product={product} />
        </div>
    );
}

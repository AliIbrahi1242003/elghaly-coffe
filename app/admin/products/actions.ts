"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    image: z.string().min(1, "Image is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
});

export async function createProduct(formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        price: formData.get("price"),
        image: formData.get("image"),
        category: formData.get("category"),
        description: formData.get("description"),
    };

    const validatedData = productSchema.safeParse(rawData);

    if (!validatedData.success) {
        return { error: validatedData.error.flatten().fieldErrors };
    }

    await db.insert(products).values(validatedData.data);
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        price: formData.get("price"),
        image: formData.get("image"),
        category: formData.get("category"),
        description: formData.get("description"),
    };

    const validatedData = productSchema.safeParse(rawData);

    if (!validatedData.success) {
        return { error: validatedData.error.flatten().fieldErrors };
    }

    await db
        .update(products)
        .set(validatedData.data)
        .where(eq(products.id, id));

    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function deleteProduct(id: number) {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/products");
}

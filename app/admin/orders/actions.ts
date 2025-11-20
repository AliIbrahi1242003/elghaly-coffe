"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: number, status: string) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
}

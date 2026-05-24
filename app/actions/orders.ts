"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/schema";
import { CheckoutFormData } from "@/lib/checkoutValidation";
import { egyptianGovernorates } from "@/lib/egyptianLocations";
import { z } from "zod";
import { inArray } from "drizzle-orm";

interface CartItem {
  id: number;
  quantity: number;
  price: number;
}

const orderSchema = z.object({
  formData: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phoneNumber: z.string().regex(/^(?:\+20|0)?1[0125]\d{8}$/, "Invalid Egyptian phone number"),
    governorate: z.coerce.number().min(1),
    city: z.string().min(1),
    detailedAddress: z.string().min(10).max(200),
  }),
  items: z.array(z.object({
    id: z.number().positive(),
    quantity: z.number().int().positive()
  })).min(1, "Order must contain at least one item")
});

export async function createOrder(rawFormData: CheckoutFormData, rawItems: CartItem[], clientTotalAmount: number) {
  try {
    // 1. Validate data using Zod
    const validatedData = orderSchema.safeParse({ formData: rawFormData, items: rawItems });
    if (!validatedData.success) {
      console.error("Validation failed", validatedData.error.format());
      return { success: false, error: "Invalid order data" };
    }
    
    const { formData, items } = validatedData.data;

    // 2. Fetch real prices from database to prevent client manipulation
    const productIds = items.map((i) => i.id);
    const dbProducts = await db.select({ id: products.id, price: products.price })
                               .from(products)
                               .where(inArray(products.id, productIds));
                               
    // 3. Recalculate total amount and prepare order items
    let realTotalAmount = 0;
    const finalOrderItemsData = [];
    
    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct) {
        return { success: false, error: `Product ID ${item.id} not found` };
      }
      
      realTotalAmount += item.quantity * dbProduct.price;
      
      finalOrderItemsData.push({
        productId: item.id,
        quantity: item.quantity,
        price: dbProduct.price // Enforce DB price
      });
    }

    // Resolve governorate name
    const governorateObj = egyptianGovernorates.find((g) => g.id === Number(formData.governorate));
    const governorateName = governorateObj ? governorateObj.nameEn : String(formData.governorate);

    // 4. Insert order using the recalculated price
    const [insertedOrder] = await db.insert(orders).values({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phoneNumber,
      address: formData.detailedAddress,
      city: formData.city,
      governorate: governorateName,
      totalAmount: realTotalAmount,
      status: "pending"
    }).returning({ insertedId: orders.id });

    const orderId = insertedOrder.insertedId;

    // 5. Insert order items
    const orderItemsWithOrderId = finalOrderItemsData.map(item => ({
      ...item,
      orderId: orderId,
    }));

    if (orderItemsWithOrderId.length > 0) {
      await db.insert(orderItems).values(orderItemsWithOrderId);
    }

    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

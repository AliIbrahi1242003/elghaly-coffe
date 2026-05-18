import { db } from "@/lib/db";
import { products } from "@/lib/schema";

export async function GET() {
  const allProducts = await db.select().from(products);

  return Response.json(
    allProducts.map((product) => ({
      id: product.id,
      title: product.title,
      category: product.category,
      description: product.description,
    }))
  );
}
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { deleteProduct } from "./actions";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming button component exists, or I'll use standard button
// I'll use standard HTML elements for now to avoid missing component issues, or check if shadcn components exist.
// Step 6 showed components dir has 12 children. I'll assume basic UI components might exist or I'll use tailwind directly.

export default async function ProductsPage() {
    const allProducts = await db.select().from(products);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 font-medium text-gray-500">Image</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Price</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {allProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-12 h-12 object-cover rounded-md"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                                <td className="px-6 py-4 text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">${product.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        <form action={deleteProduct.bind(null, product.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {allProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

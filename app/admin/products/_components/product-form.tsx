"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { createProduct, updateProduct } from "../actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    description: string;
}

interface ProductFormProps {
    product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(product?.image || "");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        if (!imageUrl) {
            setError("Please upload an image first.");
            setIsLoading(false);
            return;
        }

        formData.set("image", imageUrl);

        try {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }
            // Redirect is handled in server action, but we can refresh here just in case
            router.refresh();
        } catch (e) {
            console.error(e);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Product Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    defaultValue={product?.title}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Ethiopian Yirgacheffe"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        step="0.01"
                        min="0"
                        defaultValue={product?.price}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        type="text"
                        name="category"
                        id="category"
                        required
                        defaultValue={product?.category}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Coffee Beans"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                    {imageUrl ? (
                        <div className="relative w-full max-w-xs aspect-square mb-4">
                            <img
                                src={imageUrl}
                                alt="Product preview"
                                className="w-full h-full object-cover rounded-lg shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]) {
                                        setImageUrl(res[0].url);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    setError(`Upload failed: ${error.message}`);
                                }}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Max file size: 4MB. Supported formats: JPEG, PNG, WEBP.
                            </p>
                        </div>
                    )}
                </div>
                <input type="hidden" name="image" value={imageUrl} />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    required
                    rows={4}
                    defaultValue={product?.description}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe the product..."
                />
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="animate-spin" size={20} />}
                    {product ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
}

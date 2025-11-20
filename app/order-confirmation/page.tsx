"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrderConfirmationPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-green-100 p-4 mb-6">
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                            Order Created Successfully!
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Thank you for your purchase. We have received your order and will contact you soon to confirm the details.
                        </p>
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/shop"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10 transition-colors gap-2"
                        >
                            <ShoppingBag size={20} />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

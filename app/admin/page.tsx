import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                    <ArrowLeft size={16} />
                     home page
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">$0.00</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
                </div>
            </div>
        </div>
    );
}

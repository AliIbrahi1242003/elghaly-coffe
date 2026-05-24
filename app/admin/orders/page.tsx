import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function OrdersPage() {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const pendingOrders = allOrders.filter((order) => order.status === "pending");
    const completedOrders = allOrders.filter((order) => order.status === "completed");
    const cancelledOrders = allOrders.filter((order) => order.status === "cancelled");

    const renderOrdersTable = (title: string, ordersList: typeof allOrders, tone: string) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className={`px-6 py-4 border-b border-gray-200 ${tone}`}>
                <h2 className="font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{ordersList.length} orders</p>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 font-medium text-gray-500">Order ID</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                        <th className="px-6 py-4 font-medium text-gray-500">Total</th>
                        <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {ordersList.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 text-gray-900">
                                {order.firstName} {order.lastName}
                                <div className="text-xs text-gray-500">{order.phone}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-900 font-medium">${order.totalAmount}</td>
                            <td className="px-6 py-4 text-right">
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
                                >
                                    <Eye size={16} />
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {ordersList.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No orders found in this section.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>

            <div className="space-y-8">
                {renderOrdersTable("Pending Orders", pendingOrders, "bg-yellow-50")}
                {renderOrdersTable("Completed Orders", completedOrders, "bg-green-50")}
                {renderOrdersTable("Cancelled Orders", cancelledOrders, "bg-red-50")}
            </div>
        </div>
    );
}

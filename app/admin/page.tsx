import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/schema";
import { count, eq, sql } from "drizzle-orm";

export default async function AdminDashboard() {
    const [productCountResult, orderCountResult, revenueResult, pendingOrdersResult, completedOrdersResult, cancelledOrdersResult] = await Promise.all([
        db.select({ value: sql<number>`count(distinct ${orderItems.productId})` }).from(orderItems),
        db.select({ value: count(orders.id) }).from(orders),
        db.select({
            value: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
        }).from(orders),
        db.select({ value: count(orders.id) }).from(orders).where(eq(orders.status, "pending")),
        db.select({ value: count(orders.id) }).from(orders).where(eq(orders.status, "completed")),
        db.select({ value: count(orders.id) }).from(orders).where(eq(orders.status, "cancelled")),
    ]);

    const totalProducts = Number(productCountResult[0]?.value ?? 0);
    const totalOrders = Number(orderCountResult[0]?.value ?? 0);
    const totalRevenue = Number(revenueResult[0]?.value ?? 0);
    const pendingOrders = Number(pendingOrdersResult[0]?.value ?? 0);
    const completedOrders = Number(completedOrdersResult[0]?.value ?? 0);
    const cancelledOrders = Number(cancelledOrdersResult[0]?.value ?? 0);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-6">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        ${totalRevenue.toFixed(2)}
                    </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-yellow-700">Pending Orders</h3>
                    <p className="mt-2 text-2xl font-bold text-yellow-900">{pendingOrders}</p>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-green-700">Completed Orders</h3>
                    <p className="mt-2 text-2xl font-bold text-green-900">{completedOrders}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-red-700">Cancelled Orders</h3>
                    <p className="mt-2 text-2xl font-bold text-red-900">{cancelledOrders}</p>
                </div>
            </div>
        </div>
    );
}

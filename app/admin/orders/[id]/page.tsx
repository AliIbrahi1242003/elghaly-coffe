import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "../actions";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const orderId = parseInt(id);

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
    });

    if (!order) {
        notFound();
    }

    const items = await db
        .select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            price: orderItems.price,
            productTitle: products.title,
            productImage: products.image,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, orderId));

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-gray-500 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <form action={updateOrderStatus.bind(null, order.id, "pending")}>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 ring-2 ring-yellow-500"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Pending
                        </button>
                    </form>
                    <form action={updateOrderStatus.bind(null, order.id, "completed")}>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${order.status === "completed"
                                    ? "bg-green-100 text-green-800 ring-2 ring-green-500"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Completed
                        </button>
                    </form>
                    <form action={updateOrderStatus.bind(null, order.id, "cancelled")}>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${order.status === "cancelled"
                                    ? "bg-red-100 text-red-800 ring-2 ring-red-500"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            Cancelled
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-900">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-4">
                                    <img
                                        src={item.productImage || "/placeholder.png"}
                                        alt={item.productTitle || "Product"}
                                        className="w-16 h-16 object-cover rounded-md border border-gray-100"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.productTitle}</h3>
                                        <p className="text-sm text-gray-500">
                                            ${item.price} x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total Amount</span>
                            <span className="text-xl font-bold text-primary">${order.totalAmount}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-900">Customer Details</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Name</label>
                                <p className="text-gray-900 font-medium">{order.firstName} {order.lastName}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Phone</label>
                                <p className="text-gray-900">{order.phone}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase">Address</label>
                                <p className="text-gray-900">
                                    {order.address}<br />
                                    {order.city}, {order.governorate}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

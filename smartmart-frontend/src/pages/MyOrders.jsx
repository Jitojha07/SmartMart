import { useEffect, useState } from "react";
import axios from "axios";
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
} from "lucide-react";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                " https://smartmart-w2gb.onrender.com/api/orders"
            );

            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PLACED":
                return <Clock size={18} />;

            case "CONFIRMED":
                return <CheckCircle size={18} />;

            case "SHIPPED":
                return <Truck size={18} />;

            case "DELIVERED":
                return <CheckCircle size={18} />;

            case "CANCELLED":
                return <XCircle size={18} />;

            default:
                return <Package size={18} />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "SHIPPED":
                return "bg-blue-100 text-blue-700";

            case "CONFIRMED":
                return "bg-purple-100 text-purple-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    Loading your orders...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        My Orders
                    </h1>

                    <p className="text-gray-500 mt-2">
                        View and track your SmartMart orders
                    </p>
                </div>

                {/* No Orders */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                        <Package
                            size={60}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="text-xl font-semibold mt-5">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your placed orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
                            >

                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Order ID
                                        </p>

                                        <h2 className="text-lg font-bold text-gray-900">
                                            #{order.id}
                                        </h2>
                                    </div>

                                    <div
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>

                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 my-5"></div>

                                {/* Order Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Customer
                                        </p>

                                        <p className="font-semibold text-gray-800 mt-1">
                                            {order.firstName}{" "}
                                            {order.lastName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Payment
                                        </p>

                                        <p className="font-semibold text-gray-800 mt-1">
                                            {order.paymentMethod}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Delivery
                                        </p>

                                        <p className="font-semibold text-gray-800 mt-1">
                                            {order.city},{" "}
                                            {order.state}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="font-bold text-blue-600 text-lg mt-1">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                </div>

                                {/* Address */}
                                <div className="mt-5 bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500">
                                        Delivery Address
                                    </p>

                                    <p className="text-gray-700 mt-1">
                                        {order.address}, {order.city},{" "}
                                        {order.state} - {order.pincode}
                                    </p>
                                </div>

                                {/* Order Tracking */}
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        Order Tracking
                                    </h3>

                                    <div className="flex items-center justify-between">

                                        {/* Placed */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                                <Package size={20} />
                                            </div>

                                            <p className="text-xs sm:text-sm font-medium mt-2">
                                                Placed
                                            </p>
                                        </div>

                                        <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

                                        {/* Confirmed */}
                                        <div className="flex flex-col items-center text-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    ["CONFIRMED", "SHIPPED", "DELIVERED"].includes(
                                                        order.status
                                                    )
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-400"
                                                }`}
                                            >
                                                <CheckCircle size={20} />
                                            </div>

                                            <p className="text-xs sm:text-sm font-medium mt-2">
                                                Confirmed
                                            </p>
                                        </div>

                                        <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

                                        {/* Shipped */}
                                        <div className="flex flex-col items-center text-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    ["SHIPPED", "DELIVERED"].includes(order.status)
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-400"
                                                }`}
                                            >
                                                <Truck size={20} />
                                            </div>

                                            <p className="text-xs sm:text-sm font-medium mt-2">
                                                Shipped
                                            </p>
                                        </div>

                                        <div className="flex-1 h-1 bg-gray-200 mx-2"></div>

                                        {/* Delivered */}
                                        <div className="flex flex-col items-center text-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    order.status === "DELIVERED"
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-200 text-gray-400"
                                                }`}
                                            >
                                                <CheckCircle size={20} />
                                            </div>

                                            <p className="text-xs sm:text-sm font-medium mt-2">
                                                Delivered
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default MyOrders;
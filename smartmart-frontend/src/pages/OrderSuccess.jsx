import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import {
    CheckCircle,
    Package,
    ShoppingBag,
} from "lucide-react";

function OrderSuccess() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================================================
    // FETCH ORDER
    // =========================================================

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                console.log(
                    "Fetching order with database ID:",
                    id
                );

                const response = await axios.get(
                    `https://smartmart-w2gb.onrender.com/api/orders/${id}`
                );

                console.log(
                    "Order success response:",
                    response.data
                );

                setOrder(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch order:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };


        if (id) {
            fetchOrder();
        } else {
            setLoading(false);
        }

    }, [id]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <p className="text-gray-500 text-lg">
                    Loading order details...
                </p>

            </div>
        );
    }


    // =========================================================
    // ORDER NOT FOUND
    // =========================================================

    if (!order) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-3xl shadow-sm p-10 text-center max-w-md">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Order not found
                    </h1>

                    <p className="text-gray-500 mt-3">
                        We could not find the requested order.
                    </p>

                    <Link
                        to="/"
                        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        Go Home
                    </Link>

                </div>

            </div>
        );
    }


    // =========================================================
    // CUSTOMER ORDER NUMBER
    // =========================================================

    const customerOrderNumber =
        order.customerOrderNumber || order.id;


    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">

            <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm p-8 sm:p-10 text-center">

                {/* SUCCESS ICON */}

                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">

                    <CheckCircle
                        size={55}
                        className="text-green-600"
                    />

                </div>


                {/* TITLE */}

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-7">
                    Order Placed!
                </h1>


                <p className="text-gray-500 mt-3 leading-relaxed">
                    Thank you for shopping with SmartMart.
                    Your order has been successfully placed.
                </p>


                {/* CUSTOMER ORDER NUMBER */}

                <div className="bg-gray-50 rounded-2xl p-5 mt-7">

                    <p className="text-sm text-gray-500">
                        Your Order ID
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-1">
                        #{customerOrderNumber}
                    </p>

                </div>


                {/* STATUS */}

                <div className="grid grid-cols-2 gap-4 mt-6">

                    <div className="border border-gray-200 rounded-2xl p-4">

                        <Package
                            size={24}
                            className="mx-auto text-blue-600"
                        />

                        <p className="font-semibold mt-2">
                            Order Confirmed
                        </p>

                    </div>


                    <div className="border border-gray-200 rounded-2xl p-4">

                        <ShoppingBag
                            size={24}
                            className="mx-auto text-green-600"
                        />

                        <p className="font-semibold mt-2">
                            Preparing Order
                        </p>

                    </div>

                </div>


                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                    <Link
                        to="/products"
                        className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </Link>


                    <Link
                        to="/orders"
                        className="flex-1 border border-gray-200 py-3.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                        View My Orders
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default OrderSuccess;


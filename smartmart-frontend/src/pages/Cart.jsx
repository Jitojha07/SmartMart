import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        totalItems,
        totalPrice,
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="text-center bg-white rounded-3xl shadow-sm p-12 max-w-md">

                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag
                            size={40}
                            className="text-blue-600"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mt-6">
                        Your Cart is Empty
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Looks like you haven't added anything
                        to your cart yet.
                    </p>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 mt-7 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

                {/* HEADER */}

                <div className="mb-8">

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                    <h1 className="text-4xl font-bold text-gray-900 mt-5">
                        Shopping Cart
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CART ITEMS */}

                    <div className="lg:col-span-2 space-y-5">

                        {cartItems.map((item) => (

                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm p-5"
                            >

                                <div className="flex flex-col sm:flex-row gap-5">

                                    {/* IMAGE */}

                                    <Link
                                        to={`/products/${item.id}`}
                                        className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
                                    >

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover hover:scale-105 transition"
                                        />

                                    </Link>

                                    {/* INFORMATION */}

                                    <div className="flex-1">

                                        <div className="flex justify-between gap-4">

                                            <div>

                                                <span className="text-xs font-semibold text-blue-600">
                                                    {item.category}
                                                </span>

                                                <Link
                                                    to={`/products/${item.id}`}
                                                >
                                                    <h2 className="text-xl font-bold text-gray-900 mt-1 hover:text-blue-600">
                                                        {item.name}
                                                    </h2>
                                                </Link>

                                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                    {item.description}
                                                </p>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id
                                                    )
                                                }
                                                className="text-gray-400 hover:text-red-500 transition"
                                                title="Remove"
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">

                                            {/* PRICE */}

                                            <div>

                                                <span className="text-xl font-bold text-gray-900">
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                                <span className="text-sm text-gray-400 ml-2">
                                                    each
                                                </span>

                                            </div>

                                            {/* QUANTITY */}

                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    className="p-3 hover:bg-gray-100"
                                                >
                                                    <Minus
                                                        size={16}
                                                    />
                                                </button>

                                                <span className="px-5 font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.id
                                                        )
                                                    }
                                                    className="p-3 hover:bg-gray-100"
                                                >
                                                    <Plus
                                                        size={16}
                                                    />
                                                </button>

                                            </div>

                                            {/* ITEM TOTAL */}

                                            <div className="font-bold text-lg">
                                                ₹
                                                {Number(
                                                    item.price *
                                                        item.quantity
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* ORDER SUMMARY */}

                    <div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">

                            <h2 className="text-2xl font-bold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="border-b border-gray-200 py-5 space-y-4">

                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹
                                        {Number(
                                            totalPrice
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">

                                    <span>
                                        Delivery
                                    </span>

                                    <span className="text-green-600 font-medium">
                                        FREE
                                    </span>

                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Items
                                    </span>

                                    <span>
                                        {totalItems}
                                    </span>
                                </div>

                            </div>

                            <div className="flex justify-between items-center py-5">

                                <span className="text-xl font-bold">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-blue-600">
                                    ₹
                                    {Number(
                                        totalPrice
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center hover:bg-blue-700 transition"
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="mt-5 text-center">

                                <Link
                                    to="/products"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Continue Shopping
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Cart;
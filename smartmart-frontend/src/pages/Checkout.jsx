import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import axios from "axios";

function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        totalItems,
        totalPrice,
        clearCart,
    } = useCart();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // GET LOGGED-IN USER
    // CHECK BOTH localStorage AND sessionStorage
    // =====================================================
    const getLoggedInUser = () => {
        try {
            const localUser = localStorage.getItem("smartmartUser");

            if (localUser) {
                return JSON.parse(localUser);
            }

            const sessionUser =
                sessionStorage.getItem("smartmartUser");

            if (sessionUser) {
                return JSON.parse(sessionUser);
            }

            return null;
        } catch (error) {
            console.error(
                "Error reading logged-in user:",
                error
            );

            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // =====================================================
            // GET LOGGED-IN USER
            // =====================================================

            const user = getLoggedInUser();

            console.log(
                "Logged-in user from storage:",
                user
            );

            if (!user) {
                alert("Please login before placing an order.");
                navigate("/login");
                return;
            }

            if (!user.id) {
                console.error(
                    "Logged-in user does not contain ID:",
                    user
                );

                alert(
                    "User ID is missing. Please logout and login again."
                );

                navigate("/login");
                return;
            }

            console.log(
                "Logged-in User ID:",
                user.id
            );

            // =====================================================
            // PAYMENT METHOD
            // =====================================================

            const paymentMethod =
                document.querySelector(
                    'input[name="payment"]:checked'
                )?.value || "COD";

            // =====================================================
            // CREATE ORDER ITEMS
            // =====================================================

            const orderItems = cartItems.map((item) => {
                const productId =
                    item.productId ??
                    item.id;

                const sellerId =
                    item.sellerId ??
                    item.product?.sellerId;

                if (!productId) {
                    throw new Error(
                        `Product ID is missing for ${item.name}`
                    );
                }

                if (!sellerId) {
                    throw new Error(
                        `Seller ID is missing for product "${item.name}".`
                    );
                }

                const price = Number(item.price);
                const quantity = Number(item.quantity);

                return {
                    productId: Number(productId),
                    sellerId: Number(sellerId),
                    productName: item.name,
                    productImage: item.image || "",
                    price: price,
                    quantity: quantity,
                    subtotal: price * quantity,
                };
            });

            // =====================================================
            // COMPLETE ORDER DATA
            // =====================================================

            const orderData = {
                // IMPORTANT
                // This will now contain the actual logged-in user ID
                userId: Number(user.id),

                firstName: formData.firstName,
                lastName: formData.lastName,

                // Use checkout email if entered,
                // otherwise use logged-in user's email
                email:
                    formData.email ||
                    user.email ||
                    "",

                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,

                paymentMethod,

                totalAmount: Number(totalPrice),

                status: "PLACED",

                orderItems,
            };

            // =====================================================
            // DEBUG
            // =====================================================

            console.log(
                "===================================="
            );

            console.log(
                "Sending order:"
            );

            console.log(
                "User ID:",
                user.id
            );

            console.log(
                "Order userId:",
                orderData.userId
            );

            console.log(
                "Complete order data:",
                orderData
            );

            console.log(
                "===================================="
            );

            // =====================================================
            // CREATE ORDER
            // =====================================================

            const response = await axios.post(
                "https://smartmart-w2gb.onrender.com/api/orders",
                orderData
            );

            console.log(
                "Order created successfully:",
                response.data
            );

            // =====================================================
            // ORDER SUCCESS
            // =====================================================

            const orderId = response.data.id;

            clearCart();

            navigate(
                `/order-success/${orderId}`
            );

        } catch (error) {
            console.error(
                "Order creation failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.message ||
                "Unable to place order."
            );
        }
    };

    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-3xl shadow-sm p-10 text-center max-w-md">

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
                        Add some products before proceeding
                        to checkout.
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
                        to="/cart"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Cart
                    </Link>

                    <h1 className="text-4xl font-bold text-gray-900 mt-5">
                        Checkout
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Complete your details to place your order.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT SIDE */}

                        <div className="lg:col-span-2 space-y-6">

                            {/* CUSTOMER INFORMATION */}

                            <div className="bg-white rounded-2xl shadow-sm p-6">

                                <div className="flex items-center gap-3 mb-6">

                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <MapPin
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Delivery Information
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Where should we deliver your order?
                                        </p>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                    {/* FIRST NAME */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter first name"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* LAST NAME */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter last name"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* EMAIL */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="example@email.com"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* PHONE */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter phone number"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* ADDRESS */}

                                    <div className="sm:col-span-2">

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Address
                                        </label>

                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            placeholder="House no., street, area..."
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />

                                    </div>

                                    {/* CITY */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter city"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* STATE */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter state"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* PINCODE */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter pincode"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* PAYMENT */}

                            <div className="bg-white rounded-2xl shadow-sm p-6">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <CreditCard
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Payment Method
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Select your preferred payment method.
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-6 space-y-3">

                                    <label className="flex items-center gap-4 border border-blue-500 bg-blue-50 rounded-xl p-4 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            defaultChecked
                                        />

                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Cash on Delivery
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Pay when your order arrives.
                                            </p>
                                        </div>

                                    </label>

                                    <label className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400">

                                        <input
                                            type="radio"
                                            name="payment"
                                            value="ONLINE"
                                        />

                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Online Payment
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Online payment integration will be added later.
                                            </p>
                                        </div>

                                    </label>

                                </div>

                            </div>

                        </div>

                        {/* ORDER SUMMARY */}

                        <div>

                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Order Summary
                                </h2>

                                <div className="mt-6 space-y-4">

                                    {cartItems.map((item) => (

                                        <div
                                            key={item.id}
                                            className="flex gap-3"
                                        >

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                                            />

                                            <div className="flex-1">

                                                <h3 className="font-semibold text-gray-900 line-clamp-1">
                                                    {item.name}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>

                                                <p className="font-semibold mt-1">
                                                    ₹
                                                    {Number(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                <div className="border-t border-gray-200 mt-6 pt-5 space-y-4">

                                    <div className="flex justify-between text-gray-600">
                                        <span>Items</span>
                                        <span>{totalItems}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-medium">
                                            FREE
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 flex justify-between">

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

                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
                                >
                                    Place Order
                                </button>

                            </div>

                        </div>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default Checkout;

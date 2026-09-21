import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  User,
  ShoppingBag,
  Package,
  Clock3,
  CheckCircle2,
  MapPin,
  LogOut,
  ChevronRight,
  Truck,
  Menu,
  X,
  Home,
  Heart,
} from "lucide-react";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // BACKEND URL
  // =========================================================

  const API_URL = "https://smartmart-w2gb.onrender.com";

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

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
      console.error("Error reading logged-in user:", error);
      return null;
    }
  };

  // =========================================================
  // CREATE CUSTOMER-SPECIFIC ORDER NUMBER
  // =========================================================
  //
  // Database ID remains unchanged.
  //
  // Example:
  // User ID 5 + Order ID 12
  // => SM-5-12
  //
  // User ID 8 + Order ID 13
  // => SM-8-13
  //
  // =========================================================

  const getOrderNumber = (order) => {
    const userId = order?.userId || customer?.id;

    if (userId && order?.id) {
      return `SM-${userId}-${order.id}`;
    }

    if (order?.id) {
      return `SM-${order.id}`;
    }

    return "N/A";
  };

  // =========================================================
  // FETCH CUSTOMER DATA
  // =========================================================

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError("");

      const loggedInUser = getLoggedInUser();

      console.log("Logged-in user:", loggedInUser);

      // -------------------------------------------------------
      // CHECK LOGIN
      // -------------------------------------------------------

      if (!loggedInUser) {
        setError("Please login to access your dashboard.");
        setLoading(false);
        return;
      }

      // -------------------------------------------------------
      // CHECK USER ID
      // -------------------------------------------------------

      if (!loggedInUser.id) {
        console.error(
          "User ID missing from logged-in user:",
          loggedInUser
        );

        setError(
          "User ID is missing. Please logout and login again."
        );

        setLoading(false);
        return;
      }

      const userId = Number(loggedInUser.id);

      console.log("Customer User ID:", userId);

      // -------------------------------------------------------
      // CUSTOMER PROFILE
      // -------------------------------------------------------

      try {
        const userResponse = await axios.get(
          `${API_URL}/api/users/${userId}`
        );

        console.log(
          "Customer profile:",
          userResponse.data
        );

        setCustomer(userResponse.data);
      } catch (userError) {
        console.error(
          "Could not load profile from backend:",
          userError
        );

        // Fallback to logged-in user
        setCustomer(loggedInUser);
      }

      // -------------------------------------------------------
      // GET ONLY THIS USER'S ORDERS
      // -------------------------------------------------------

      const ordersResponse = await axios.get(
        `${API_URL}/api/orders/user/${userId}`
      );

      console.log(
        "Orders returned from backend:",
        ordersResponse.data
      );

      const customerOrders = Array.isArray(
        ordersResponse.data
      )
        ? ordersResponse.data
        : [];

      // -------------------------------------------------------
      // EXTRA SAFETY FILTER
      //
      // Even if backend accidentally returns another order,
      // frontend will not display it.
      // -------------------------------------------------------

      const filteredOrders = customerOrders.filter(
        (order) =>
          Number(order.userId) === userId
      );

      // -------------------------------------------------------
      // NEWEST ORDERS FIRST
      // -------------------------------------------------------

      filteredOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);

        return dateB - dateA;
      });

      console.log(
        "Filtered customer orders:",
        filteredOrders
      );

      setOrders(filteredOrders);
    } catch (error) {
      console.error(
        "Failed to load customer dashboard:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setOrders([]);

      setError(
        error.response?.data?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("smartmartUser");
    sessionStorage.removeItem("smartmartUser");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================================
  // MENU
  // =========================================================

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "orders",
      label: "My Orders",
      icon: ShoppingBag,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
    },
    {
      id: "address",
      label: "Saved Address",
      icon: MapPin,
    },
  ];

  // =========================================================
  // STATUS STYLE
  // =========================================================

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

      case "PLACED":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // STATUS ICON
  // =========================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle2 size={15} />;

      case "SHIPPED":
        return <Truck size={15} />;

      case "CONFIRMED":
        return <CheckCircle2 size={15} />;

      case "PLACED":
        return <Clock3 size={15} />;

      case "CANCELLED":
        return <Clock3 size={15} />;

      default:
        return <Clock3 size={15} />;
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const getCustomerName = () => {
    if (!customer) {
      return "Customer";
    }

    if (customer.fullName) {
      return customer.fullName;
    }

    if (
      customer.firstName ||
      customer.lastName
    ) {
      return `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();
    }

    if (customer.name) {
      return customer.name;
    }

    return "Customer";
  };

  const customerName = getCustomerName();

  // =========================================================
  // CUSTOMER DETAILS
  // =========================================================

  const customerEmail = customer?.email || "";

  const customerPhone =
    customer?.phone ||
    customer?.mobile ||
    "Not available";

  const getMemberSince = () => {
    if (customer?.createdAt) {
      return new Date(
        customer.createdAt
      ).getFullYear();
    }

    return "2026";
  };

  // =========================================================
  // ORDER STATISTICS
  // =========================================================

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "DELIVERED"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.status === "PLACED" ||
      order.status === "CONFIRMED" ||
      order.status === "SHIPPED"
  ).length;

  // =========================================================
  // RECENT ORDERS
  // =========================================================

  const recentOrders = orders.slice(0, 3);

  // =========================================================
  // LATEST ORDER
  // =========================================================

  const latestOrder =
    orders.length > 0
      ? orders[0]
      : null;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-5 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <User size={28} />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mt-5">
            Unable to Load Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchCustomerData}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              S
            </span>
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              SmartMart
            </h1>

            <p className="text-xs text-gray-500">
              Customer Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenu ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside
            className={`lg:block ${
              mobileMenu ? "block" : "hidden"
            }`}
          >
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              {/* PROFILE HEADER */}

              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 text-white">

                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {customerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h2 className="font-bold text-lg">
                  {customerName}
                </h2>

                <p className="text-blue-100 text-sm mt-1 break-all">
                  {customerEmail}
                </p>

              </div>

              {/* NAVIGATION */}

              <div className="p-3">

                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={19} />

                      <span className="font-medium">
                        {item.label}
                      </span>

                      {item.id === "orders" &&
                        orders.length > 0 && (
                          <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                            {orders.length}
                          </span>
                        )}
                    </button>
                  );
                })}

                <div className="border-t border-gray-200 my-3" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-left transition"
                >
                  <LogOut size={19} />

                  <span className="font-medium">
                    Logout
                  </span>
                </button>

              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <main className="lg:col-span-3">

            {/* =================================================
                DASHBOARD
            ================================================= */}

            {activeTab === "dashboard" && (
              <div>

                <div className="mb-8">
                  <p className="text-blue-600 font-semibold text-sm">
                    CUSTOMER DASHBOARD
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                    Welcome back,{" "}
                    {customerName.split(" ")[0]}! 👋
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Here's what's happening with your SmartMart account.
                  </p>
                </div>

                {/* STAT CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                  {/* TOTAL ORDERS */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={22} />
                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Total Orders
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {totalOrders}
                    </h3>
                  </div>

                  {/* DELIVERED */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={22} />
                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Delivered
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {deliveredOrders}
                    </h3>
                  </div>

                  {/* PROCESSING */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                      <Clock3 size={22} />
                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Processing
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {processingOrders}
                    </h3>
                  </div>

                  {/* WISHLIST */}

                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="w-11 h-11 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                      <Heart size={22} />
                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Wishlist
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      0
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Coming soon
                    </p>
                  </div>

                </div>

                {/* RECENT ORDERS */}

                <div className="bg-white rounded-2xl border border-gray-200 mt-8 overflow-hidden">

                  <div className="p-6 flex items-center justify-between border-b border-gray-200">

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Recent Orders
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Your latest purchases
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setActiveTab("orders")
                      }
                      className="flex items-center gap-1 text-blue-600 font-medium text-sm"
                    >
                      View All
                      <ChevronRight size={17} />
                    </button>

                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="p-10 text-center">

                      <Package
                        size={45}
                        className="mx-auto text-gray-300"
                      />

                      <h3 className="font-semibold text-gray-800 mt-4">
                        No orders yet
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Your recent orders will appear here.
                      </p>

                      <Link
                        to="/products"
                        className="inline-block mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                      >
                        Start Shopping
                      </Link>

                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">

                      {recentOrders.map((order) => {
                        const itemCount =
                          order.orderItems?.reduce(
                            (total, item) =>
                              total +
                              Number(
                                item.quantity || 0
                              ),
                            0
                          ) || 0;

                        return (
                          <div
                            key={order.id}
                            className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                          >

                            <div className="flex items-center gap-4">

                              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Package
                                  size={21}
                                  className="text-gray-600"
                                />
                              </div>

                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {getOrderNumber(order)}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(
                                    order.createdAt
                                  )}
                                  {" • "}
                                  {itemCount} item
                                  {itemCount !== 1
                                    ? "s"
                                    : ""}
                                </p>
                              </div>

                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-5">

                              <span className="font-bold text-gray-900">
                                ₹
                                {Number(
                                  order.totalAmount || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(
                                  order.status
                                )}

                                {order.status}
                              </span>

                            </div>
                          </div>
                        );
                      })}

                    </div>
                  )}

                </div>

                {/* QUICK ACTIONS */}

                <div className="mt-8">

                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <Link
                      to="/products"
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition group"
                    >
                      <ShoppingBag
                        size={23}
                        className="text-blue-600"
                      />

                      <h3 className="font-semibold text-gray-900 mt-3">
                        Continue Shopping
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Explore new products
                      </p>
                    </Link>

                    <button
                      onClick={() =>
                        setActiveTab("profile")
                      }
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition text-left"
                    >
                      <User
                        size={23}
                        className="text-purple-600"
                      />

                      <h3 className="font-semibold text-gray-900 mt-3">
                        View Profile
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        View your account information
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setActiveTab("address")
                      }
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition text-left"
                    >
                      <MapPin
                        size={23}
                        className="text-green-600"
                      />

                      <h3 className="font-semibold text-gray-900 mt-3">
                        Manage Address
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        View your latest delivery address
                      </p>
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                MY ORDERS
            ================================================= */}

            {activeTab === "orders" && (
              <div>

                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Orders
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Track and manage your orders.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

                    <Package
                      size={55}
                      className="mx-auto text-gray-300"
                    />

                    <h2 className="text-xl font-semibold mt-5">
                      No orders yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Your placed orders will appear here.
                    </p>

                    <Link
                      to="/products"
                      className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
                    >
                      Start Shopping
                    </Link>

                  </div>
                ) : (
                  <div className="space-y-5">

                    {orders.map((order) => {
                      const status = order.status;

                      const itemCount =
                        order.orderItems?.reduce(
                          (total, item) =>
                            total +
                            Number(
                              item.quantity || 0
                            ),
                          0
                        ) || 0;

                      return (
                        <div
                          key={order.id}
                          className="bg-white border border-gray-200 rounded-2xl p-6"
                        >

                          {/* ORDER HEADER */}

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                              <p className="text-sm text-gray-500">
                                Order Number
                              </p>

                              <h2 className="font-bold text-xl text-gray-900">
                                {getOrderNumber(order)}
                              </h2>

                              <p className="text-xs text-gray-400 mt-1">
                                Order ID: #{order.id}
                              </p>

                              <p className="text-sm text-gray-500 mt-2">
                                Placed on{" "}
                                {formatDate(
                                  order.createdAt
                                )}
                                {" • "}
                                {itemCount} item
                                {itemCount !== 1
                                  ? "s"
                                  : ""}
                              </p>

                            </div>

                            <div className="flex items-center gap-5">

                              <div className="text-right">

                                <p className="text-sm text-gray-500">
                                  Total
                                </p>

                                <p className="font-bold text-gray-900 text-lg">
                                  ₹
                                  {Number(
                                    order.totalAmount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                              </div>

                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold ${getStatusStyle(
                                  status
                                )}`}
                              >
                                {getStatusIcon(status)}
                                {status}
                              </span>

                            </div>

                          </div>

                          {/* ORDER ITEMS */}

                          {order.orderItems &&
                            order.orderItems.length >
                              0 && (
                              <div className="mt-5 pt-5 border-t border-gray-100">

                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                  Items
                                </p>

                                <div className="space-y-3">

                                  {order.orderItems.map(
                                    (item, index) => (
                                      <div
                                        key={
                                          item.id ||
                                          `${order.id}-${index}`
                                        }
                                        className="flex items-center gap-3"
                                      >

                                        <img
                                          src={
                                            item.productImage
                                          }
                                          alt={
                                            item.productName ||
                                            "Product"
                                          }
                                          className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />

                                        <div className="flex-1">

                                          <p className="font-medium text-gray-900">
                                            {
                                              item.productName
                                            }
                                          </p>

                                          <p className="text-sm text-gray-500">
                                            Qty:{" "}
                                            {
                                              item.quantity
                                            }
                                          </p>

                                        </div>

                                        <p className="font-semibold text-gray-900">
                                          ₹
                                          {Number(
                                            item.subtotal ||
                                              0
                                          ).toLocaleString(
                                            "en-IN"
                                          )}
                                        </p>

                                      </div>
                                    )
                                  )}

                                </div>

                              </div>
                            )}

                          {/* ORDER PROGRESS */}

                          {status !== "CANCELLED" && (
                            <div className="mt-6 pt-5 border-t border-gray-100">

                              <div className="grid grid-cols-4 gap-2">

                                {/* PLACED */}

                                <div className="text-center">

                                  <div className="w-9 h-9 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center">
                                    <Package size={18} />
                                  </div>

                                  <p className="text-xs font-medium text-gray-700 mt-2">
                                    Placed
                                  </p>

                                </div>

                                {/* CONFIRMED */}

                                <div className="text-center">

                                  <div
                                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center ${
                                      [
                                        "CONFIRMED",
                                        "SHIPPED",
                                        "DELIVERED",
                                      ].includes(status)
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    <CheckCircle2 size={18} />
                                  </div>

                                  <p className="text-xs font-medium text-gray-700 mt-2">
                                    Confirmed
                                  </p>

                                </div>

                                {/* SHIPPED */}

                                <div className="text-center">

                                  <div
                                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center ${
                                      [
                                        "SHIPPED",
                                        "DELIVERED",
                                      ].includes(status)
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    <Truck size={18} />
                                  </div>

                                  <p className="text-xs font-medium text-gray-700 mt-2">
                                    Shipped
                                  </p>

                                </div>

                                {/* DELIVERED */}

                                <div className="text-center">

                                  <div
                                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center ${
                                      status ===
                                      "DELIVERED"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    <CheckCircle2 size={18} />
                                  </div>

                                  <p className="text-xs font-medium text-gray-700 mt-2">
                                    Delivered
                                  </p>

                                </div>

                              </div>

                            </div>
                          )}

                          {/* CANCELLED */}

                          {status === "CANCELLED" && (
                            <div className="mt-5 pt-5 border-t border-gray-100">

                              <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm font-medium">
                                This order has been cancelled.
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>
            )}

            {/* =================================================
                PROFILE
            ================================================= */}

            {activeTab === "profile" && (
              <div>

                <div className="mb-8">

                  <h1 className="text-3xl font-bold text-gray-900">
                    My Profile
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Manage your personal information.
                  </p>

                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">

                  <div className="flex items-center gap-5 pb-6 border-b border-gray-200">

                    <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold">
                      {customerName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        {customerName}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        SmartMart member since{" "}
                        {getMemberSince()}
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Full Name
                      </label>

                      <div className="mt-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                        {customerName}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email Address
                      </label>

                      <div className="mt-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 break-all">
                        {customerEmail ||
                          "Not available"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone Number
                      </label>

                      <div className="mt-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                        {customerPhone}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Account Type
                      </label>

                      <div className="mt-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                        {customer?.role ||
                          "CUSTOMER"}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                ADDRESS
            ================================================= */}

            {activeTab === "address" && (
              <div>

                <div className="mb-8">

                  <h1 className="text-3xl font-bold text-gray-900">
                    Saved Address
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Your latest delivery address.
                  </p>

                </div>

                {latestOrder ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">

                    <div className="flex gap-4">

                      <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin size={21} />
                      </div>

                      <div>

                        <div className="flex items-center gap-2">

                          <h2 className="font-bold text-gray-900">
                            Latest Delivery Address
                          </h2>

                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Used
                          </span>

                        </div>

                        <p className="text-gray-600 mt-2 leading-relaxed">

                          {latestOrder.firstName}{" "}
                          {latestOrder.lastName}

                          <br />

                          {latestOrder.address}

                          <br />

                          {latestOrder.city},{" "}
                          {latestOrder.state}

                          <br />

                          {latestOrder.pincode}

                        </p>

                        {latestOrder.phone && (
                          <p className="text-sm text-gray-500 mt-2">
                            Phone:{" "}
                            {latestOrder.phone}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">

                    <MapPin
                      size={50}
                      className="mx-auto text-gray-300"
                    />

                    <h2 className="text-xl font-semibold mt-4">
                      No saved address
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Your delivery address will appear here after placing an order.
                    </p>

                  </div>
                )}

              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;

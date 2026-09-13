import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminUsers from "../components/AdminUsers";
import AdminProducts from "../components/AdminProducts";
import AdminSellers from "../components/AdminSellers";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Store,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  Save,
  RotateCcw,
  Store as StoreIcon,
  CreditCard,
  BellRing,
  ShoppingBag as OrderIcon,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // =====================================================
  // ORDERS STATE
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");

  // =====================================================
  // USERS STATE
  // =====================================================

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState("");

  // =====================================================
  // PRODUCTS STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] =
    useState(false);

  // =====================================================
  // SETTINGS
  // =====================================================

  const defaultSettings = {
    storeName: "SmartMart",
    supportEmail: "support@smartmart.com",
    supportPhone: "+91 98765 43210",

    minOrderAmount: "0",

    ordersEnabled: true,

    codEnabled: true,
    onlinePaymentEnabled: false,

    orderNotifications: true,
    customerNotifications: true,
    sellerNotifications: true,
  };

  const [settings, setSettings] =
    useState(defaultSettings);

  const [settingsSaved, setSettingsSaved] =
    useState(false);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(
        "smartmartAdminSettings"
      );

    if (savedSettings) {
      try {
        const parsedSettings =
          JSON.parse(savedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      } catch (error) {
        console.error(
          "Failed to load admin settings:",
          error
        );
      }
    }
  }, []);

  // =====================================================
  // SETTINGS HANDLERS
  // =====================================================

  const handleSettingChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSettingsSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "smartmartAdminSettings",
      JSON.stringify(settings)
    );

    setSettingsSaved(true);

    setTimeout(() => {
      setSettingsSaved(false);
    }, 3000);
  };

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all admin settings to default?"
    );

    if (!confirmed) {
      return;
    }

    setSettings(defaultSettings);

    localStorage.setItem(
      "smartmartAdminSettings",
      JSON.stringify(defaultSettings)
    );

    setSettingsSaved(true);

    setTimeout(() => {
      setSettingsSaved(false);
    }, 3000);
  };

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrderError("");

      const response = await axios.get(
        "http://localhost:8080/api/orders"
      );

      console.log(
        "Orders from backend:",
        response.data
      );

      const formattedOrders = response.data.map(
        (order) => ({
          backendId: order.id,

          id: `#SM${String(order.id).padStart(
            4,
            "0"
          )}`,

          customer:
            `${order.firstName || ""} ${
              order.lastName || ""
            }`.trim() ||
            order.email ||
            "Customer",

          email: order.email || "",

          product: "Order",

          amount: `₹${Number(
            order.totalAmount || 0
          ).toFixed(2)}`,

          status: order.status || "PLACED",

          date: order.createdAt
            ? new Date(
                order.createdAt
              ).toLocaleDateString()
            : "N/A",
        })
      );

      setOrders(formattedOrders);
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      setOrderError(
        "Unable to load orders. Make sure the Spring Boot backend is running."
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setUserError("");

      const response = await axios.get(
        "http://localhost:8080/api/users"
      );

      console.log(
        "Users from backend:",
        response.data
      );

      setUsers(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );

      setUserError(
        "Failed to load users from the server."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await axios.get(
        "http://localhost:8080/api/products"
      );

      console.log(
        "Products from backend:",
        response.data
      );

      setProducts(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    backendId,
    newStatus
  ) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/${backendId}/status?status=${newStatus}`
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert("Failed to update order status.");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("smartmartUser");
    localStorage.removeItem("smartmartToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("smartmartUser");
    sessionStorage.removeItem("smartmartToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchProducts();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalUsers = users.length;

  const totalSellers = users.filter(
    (user) =>
      String(user.role || "").toUpperCase() ===
      "SELLER"
  ).length;

  const totalProducts = products.length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      change: "Live",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Sellers",
      value: totalSellers,
      change: "Live",
      icon: Store,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Total Products",
      value: loadingProducts
        ? "..."
        : totalProducts,
      change: "Live",
      icon: Package,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Total Orders",
      value: orders.length,
      change: "Live",
      icon: ShoppingCart,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // =====================================================
  // SIDEBAR MENU
  // =====================================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Users",
      icon: Users,
    },

    {
      name: "Products",
      icon: Package,
    },

    {
      name: "Orders",
      icon: ShoppingCart,
    },

    {
      name: "Sellers",
      icon: Store,
    },

    {
      name: "Settings",
      icon: Settings,
    },
  ];

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "PLACED":
        return <Clock size={14} />;

      case "CONFIRMED":
        return <CheckCircle size={14} />;

      case "SHIPPED":
        return <ShoppingBag size={14} />;

      case "DELIVERED":
        return <CheckCircle size={14} />;

      case "CANCELLED":
        return <XCircle size={14} />;

      default:
        return null;
    }
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "PLACED":
        return "Processing";

      case "CONFIRMED":
        return "Confirmed";

      case "SHIPPED":
        return "Shipped";

      case "DELIVERED":
        return "Delivered";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
  };

  // =====================================================
  // DASHBOARD VIEW
  // =====================================================

  const renderDashboard = () => {
    return (
      <>
        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}
                  >
                    <Icon size={23} />
                  </div>

                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-5">
                  {stat.title}
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </div>

        {/* REVENUE */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Revenue Overview
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Monthly marketplace performance
                </p>
              </div>

              <TrendingUp
                className="text-green-600"
                size={22}
              />
            </div>

            <div className="mt-8">
              <div className="flex items-end gap-3 h-48">
                {[
                  35,
                  55,
                  45,
                  70,
                  60,
                  80,
                  68,
                  92,
                  76,
                  85,
                  95,
                  100,
                ].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 flex items-end h-full"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 mt-3 text-xs text-gray-400 text-center">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <span key={month}>
                    {month}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* REVENUE CARD */}

          <div className="bg-blue-600 rounded-2xl p-6 text-white">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <DollarSign size={25} />
            </div>

            <p className="text-blue-100 text-sm mt-6">
              Total Revenue
            </p>

            <h3 className="text-4xl font-bold mt-2">
              ₹24.8L
            </h3>

            <div className="flex items-center gap-2 mt-4">
              <TrendingUp size={17} />

              <span className="text-sm">
                18.4% from last month
              </span>
            </div>

            <button
              onClick={() =>
                setActiveMenu("Orders")
              }
              className="mt-8 w-full py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition"
            >
              View Orders
            </button>
          </div>
        </div>

        {/* RECENT ORDERS + USERS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* RECENT ORDERS */}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">
                  Recent Orders
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Latest marketplace orders
                </p>
              </div>

              <button
                onClick={() =>
                  setActiveMenu("Orders")
                }
                className="text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                View All
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center">
                <RefreshCw
                  className="mx-auto animate-spin text-blue-600"
                  size={25}
                />

                <p className="text-gray-500 mt-2">
                  Loading orders...
                </p>
              </div>
            ) : orderError ? (
              <div className="p-8 text-center text-red-500">
                {orderError}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No orders available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-5 py-3">
                        Order
                      </th>

                      <th className="text-left px-5 py-3">
                        Customer
                      </th>

                      <th className="text-left px-5 py-3">
                        Amount
                      </th>

                      <th className="text-left px-5 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders
                      .slice(0, 5)
                      .map((order) => (
                        <tr
                          key={order.backendId}
                          className="border-t border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-5 py-4 font-medium">
                            {order.id}
                          </td>

                          <td className="px-5 py-4">
                            {order.customer}
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            {order.amount}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(
                                order.status
                              )}

                              {getStatusLabel(
                                order.status
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RECENT USERS */}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">
                  Recent Users
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Recently registered users
                </p>
              </div>

              <button
                onClick={() =>
                  setActiveMenu("Users")
                }
                className="text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                View All
              </button>
            </div>

            {loadingUsers ? (
              <div className="p-8 text-center">
                <RefreshCw
                  className="mx-auto animate-spin text-blue-600"
                  size={25}
                />

                <p className="text-gray-500 mt-2">
                  Loading users...
                </p>
              </div>
            ) : userError ? (
              <div className="p-8 text-center text-red-500">
                {userError}
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users
                  className="mx-auto text-gray-300"
                  size={45}
                />

                <p className="mt-3">
                  No users found.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users
                  .slice(0, 5)
                  .map((user, index) => (
                    <div
                      key={user.id}
                      className="p-4 flex items-center gap-3 hover:bg-gray-50"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          index % 2 === 0
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {user.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.name ||
                            "Unknown User"}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {user.email ||
                            "No email"}
                        </p>
                      </div>

                      <div className="hidden sm:block">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {user.role ||
                            "CUSTOMER"}
                        </span>
                      </div>

                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={17} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-6">
          <h3 className="font-bold text-gray-900 text-lg">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <button
              onClick={() =>
                setActiveMenu("Users")
              }
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md transition"
            >
              <Users
                className="text-blue-600"
                size={23}
              />

              <p className="font-semibold mt-3">
                Manage Users
              </p>

              <p className="text-xs text-gray-500 mt-1">
                View and manage users
              </p>
            </button>

            <button
              onClick={() =>
                setActiveMenu("Products")
              }
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md transition"
            >
              <Package
                className="text-green-600"
                size={23}
              />

              <p className="font-semibold mt-3">
                Manage Products
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Add or remove products
              </p>
            </button>

            <button
              onClick={() =>
                setActiveMenu("Sellers")
              }
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md transition"
            >
              <Store
                className="text-purple-600"
                size={23}
              />

              <p className="font-semibold mt-3">
                Manage Sellers
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Review seller accounts
              </p>
            </button>

            <button
              onClick={() =>
                setActiveMenu("Orders")
              }
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md transition"
            >
              <ShoppingBag
                className="text-orange-600"
                size={23}
              />

              <p className="font-semibold mt-3">
                Manage Orders
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Track marketplace orders
              </p>
            </button>
          </div>
        </div>
      </>
    );
  };

  // =====================================================
  // ORDERS PAGE
  // =====================================================

  const renderOrders = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Orders Management
            </h2>

            <p className="text-gray-500 mt-1">
              View and manage all marketplace orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loadingOrders}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loadingOrders
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Orders
          </button>
        </div>

        {orderError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {orderError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h3 className="text-2xl font-bold mt-1">
              {orders.length}
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Processing
            </p>

            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
              {
                orders.filter(
                  (order) =>
                    order.status === "PLACED"
                ).length
              }
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {
                orders.filter(
                  (order) =>
                    order.status === "SHIPPED"
                ).length
              }
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <h3 className="text-2xl font-bold text-green-600 mt-1">
              {
                orders.filter(
                  (order) =>
                    order.status === "DELIVERED"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-lg">
              All Orders
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Orders loaded directly from your Spring Boot backend
            </p>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center">
              <RefreshCw
                className="mx-auto animate-spin text-blue-600"
                size={30}
              />

              <p className="text-gray-500 mt-3">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart
                className="mx-auto text-gray-300"
                size={50}
              />

              <h3 className="font-semibold text-gray-900 mt-4">
                No orders found
              </h3>

              <p className="text-gray-500 mt-1">
                Orders will appear here when customers place them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Order ID
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Product
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.backendId}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {order.id}
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.customer}
                          </p>

                          {order.email && (
                            <p className="text-xs text-gray-500 mt-1">
                              {order.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-gray-600">
                          {order.product}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {order.amount}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(
                            order.status
                          )}

                          {getStatusLabel(
                            order.status
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {order.date}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                            title="View order"
                          >
                            <Eye size={17} />
                          </button>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.backendId,
                                e.target.value
                              )
                            }
                            className="border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="PLACED">
                              Processing
                            </option>

                            <option value="CONFIRMED">
                              Confirmed
                            </option>

                            <option value="SHIPPED">
                              Shipped
                            </option>

                            <option value="DELIVERED">
                              Delivered
                            </option>

                            <option value="CANCELLED">
                              Cancelled
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // SETTINGS PAGE
  // =====================================================

  const renderSettings = () => {
    return (
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Admin Settings
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your SmartMart marketplace settings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetSettings}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <RotateCcw size={17} />

              Reset
            </button>

            <button
              onClick={saveSettings}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save size={17} />

              Save Settings
            </button>
          </div>
        </div>

        {settingsSaved && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">
            <CheckCircle size={20} />

            <div>
              <p className="font-semibold">
                Settings saved successfully
              </p>

              <p className="text-sm">
                Your admin settings have been saved on this device.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* GENERAL SETTINGS */}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <StoreIcon size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  General Settings
                </h3>

                <p className="text-sm text-gray-500">
                  Basic information about your marketplace
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Store Name
                </label>

                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) =>
                    handleSettingChange(
                      "storeName",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SmartMart"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Support Email
                </label>

                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    handleSettingChange(
                      "supportEmail",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="support@smartmart.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Support Phone
                </label>

                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    handleSettingChange(
                      "supportPhone",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* ORDER SETTINGS */}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <OrderIcon size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Order Settings
                </h3>

                <p className="text-sm text-gray-500">
                  Control marketplace order behaviour
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* ENABLE ORDERS */}

              <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Accept New Orders
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Allow customers to place new orders.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettingChange(
                      "ordersEnabled",
                      !settings.ordersEnabled
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.ordersEnabled
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                      settings.ordersEnabled
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* MINIMUM ORDER */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Order Amount
                </label>

                <div className="relative max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={settings.minOrderAmount}
                    onChange={(e) =>
                      handleSettingChange(
                        "minOrderAmount",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Set 0 if there is no minimum order requirement.
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT SETTINGS */}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <CreditCard size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Payment Settings
                </h3>

                <p className="text-sm text-gray-500">
                  Choose which payment methods are available
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* COD */}

              <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Cash on Delivery
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Allow customers to pay when their order arrives.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettingChange(
                      "codEnabled",
                      !settings.codEnabled
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.codEnabled
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                      settings.codEnabled
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* ONLINE PAYMENT */}

              <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Online Payment
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Enable online payment methods.
                  </p>

                  <p className="text-xs text-orange-600 mt-1">
                    Payment gateway integration is required for actual online payments.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettingChange(
                      "onlinePaymentEnabled",
                      !settings.onlinePaymentEnabled
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.onlinePaymentEnabled
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                      settings.onlinePaymentEnabled
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* NOTIFICATION SETTINGS */}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <BellRing size={22} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Notification Settings
                </h3>

                <p className="text-sm text-gray-500">
                  Control marketplace notification preferences
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* ORDER NOTIFICATIONS */}

              <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Order Notifications
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Receive notifications for new orders.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettingChange(
                      "orderNotifications",
                      !settings.orderNotifications
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.orderNotifications
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                      settings.orderNotifications
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* CUSTOMER NOTIFICATIONS */}

              <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Customer Notifications
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Enable customer-related notification settings.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettingChange(
                      "customerNotifications",
                      !settings.customerNotifications
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.customerNotifications
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                      settings.customerNotifications
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* SELLER NOTIFICATIONS */}

              <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Seller Notifications
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Enable seller-related notification settings.
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettingChange(
                      "sellerNotifications",
                      !settings.sellerNotifications
                    )
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.sellerNotifications
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                      settings.sellerNotifications
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ADMIN INFORMATION */}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Settings size={20} />
              </div>

              <div>
                <h3 className="font-bold text-blue-900">
                  Admin Settings Information
                </h3>

                <p className="text-sm text-blue-700 mt-2 leading-6">
                  These settings are currently stored locally in
                  your browser. They control the admin dashboard
                  preferences, but payment gateway and notification
                  delivery require backend integration to become
                  fully functional.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM SAVE */}

          <div className="flex justify-end gap-3 pb-4">
            <button
              onClick={resetSettings}
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <RotateCcw size={17} />

              Reset Settings
            </button>

            <button
              onClick={saveSettings}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save size={17} />

              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // PLACEHOLDER
  // =====================================================

  const renderPlaceholder = () => {
    const selected = menuItems.find(
      (item) => item.name === activeMenu
    );

    const Icon = selected?.icon;

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
          {Icon && <Icon size={30} />}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-5">
          {activeMenu}
        </h2>

        <p className="text-gray-500 mt-2">
          The {activeMenu.toLowerCase()} management section
          will be connected to the backend soon.
        </p>
      </div>
    );
  };

  // =====================================================
  // MAIN CONTENT SWITCH
  // =====================================================

  const renderContent = () => {
    if (activeMenu === "Dashboard") {
      return renderDashboard();
    }

    if (activeMenu === "Orders") {
      return renderOrders();
    }

    if (activeMenu === "Users") {
      return <AdminUsers />;
    }

    if (activeMenu === "Products") {
      return <AdminProducts />;
    }

    if (activeMenu === "Sellers") {
      return <AdminSellers />;
    }

    if (activeMenu === "Settings") {
      return renderSettings();
    }

    return renderPlaceholder();
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}

        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-xl">
                S
              </span>
            </div>

            <div>
              <h1 className="font-bold text-lg">
                SmartMart
              </h1>

              <p className="text-xs text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeMenu === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={19} />

                {item.name}

                {item.name === "Orders" &&
                  orders.length > 0 && (
                    <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}

                {item.name === "Products" &&
                  products.length > 0 && (
                    <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {products.length}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        {/* ADMIN PROFILE */}

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              A
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                Admin
              </p>

              <p className="text-xs text-gray-500 truncate">
                admin@smartmart.com
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div className="flex-1 min-w-0">
        {/* HEADER */}

        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {activeMenu}
              </h2>

              <p className="hidden sm:block text-sm text-gray-500">
                Welcome back, Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SEARCH */}

            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none ml-2 text-sm w-32 lg:w-48"
              />
            </div>

            {/* NOTIFICATION */}

            <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition">
              <Bell
                size={21}
                className="text-gray-600"
              />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* CONTENT */}

        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
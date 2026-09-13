import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  CreditCard,
  Menu,
  X,
  Home,
  Heart,
} from "lucide-react";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  // Temporary customer data
  // Later this will come from Spring Boot API.
  const customer = {
    name: "Jit Ojha",
    email: "jit@example.com",
    phone: "+91 98765 43210",
    memberSince: "2026",
  };

  // Temporary order data
  const orders = [
    {
      id: "SM-1001",
      date: "28 Aug 2026",
      status: "Delivered",
      statusType: "delivered",
      total: 1499,
      items: 1,
    },
    {
      id: "SM-1002",
      date: "30 Aug 2026",
      status: "Shipped",
      statusType: "shipped",
      total: 2499,
      items: 1,
    },
    {
      id: "SM-1003",
      date: "31 Aug 2026",
      status: "Processing",
      statusType: "processing",
      total: 1899,
      items: 2,
    },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

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

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Shipped") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Processing") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    if (status === "Delivered") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "Shipped") {
      return <Truck size={15} />;
    }

    return <Clock3 size={15} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================================= */}
      {/* MOBILE HEADER */}
      {/* ================================================= */}

      <div className="lg:hidden bg-white border-b border-gray-200
        px-4 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-600 rounded-xl
            flex items-center justify-center">

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
          onClick={() => setMobileMenu(!mobileMenu)}
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

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside
            className={`lg:block ${
              mobileMenu ? "block" : "hidden"
            }`}
          >

            <div className="bg-white rounded-2xl
              border border-gray-200 overflow-hidden">

              {/* Profile Header */}

              <div className="p-6 bg-gradient-to-br
                from-blue-600 to-blue-500 text-white">

                <div className="w-16 h-16 bg-white/20
                  rounded-full flex items-center justify-center
                  text-2xl font-bold mb-4">

                  {customer.name.charAt(0)}

                </div>

                <h2 className="font-bold text-lg">
                  {customer.name}
                </h2>

                <p className="text-blue-100 text-sm mt-1">
                  {customer.email}
                </p>

              </div>


              {/* Navigation */}

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
                      className={`w-full flex items-center gap-3
                        px-4 py-3 rounded-xl mb-1
                        text-left transition ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >

                      <Icon size={19} />

                      <span className="font-medium">
                        {item.label}
                      </span>

                    </button>
                  );

                })}


                <div className="border-t border-gray-200 my-3" />


                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3
                    px-4 py-3 rounded-xl
                    text-red-600 hover:bg-red-50
                    text-left transition"
                >

                  <LogOut size={19} />

                  <span className="font-medium">
                    Logout
                  </span>

                </button>

              </div>

            </div>

          </aside>


          {/* ================================================= */}
          {/* MAIN CONTENT */}
          {/* ================================================= */}

          <main className="lg:col-span-3">

            {/* ================= DASHBOARD ================= */}

            {activeTab === "dashboard" && (
              <div>

                {/* Welcome */}

                <div className="mb-8">

                  <p className="text-blue-600 font-semibold text-sm">
                    CUSTOMER DASHBOARD
                  </p>

                  <h1 className="text-3xl md:text-4xl
                    font-bold text-gray-900 mt-1">

                    Welcome back, {customer.name.split(" ")[0]}! 👋

                  </h1>

                  <p className="text-gray-500 mt-2">
                    Here's what's happening with your SmartMart account.
                  </p>

                </div>


                {/* ================= STAT CARDS ================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                  {/* Orders */}

                  <div className="bg-white rounded-2xl
                    border border-gray-200 p-5">

                    <div className="flex items-center justify-between">

                      <div className="w-11 h-11 bg-blue-100
                        text-blue-600 rounded-xl
                        flex items-center justify-center">

                        <ShoppingBag size={22} />

                      </div>

                      <span className="text-xs font-medium
                        text-green-600 bg-green-50 px-2 py-1 rounded-full">

                        +12%

                      </span>

                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Total Orders
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      12
                    </h3>

                  </div>


                  {/* Delivered */}

                  <div className="bg-white rounded-2xl
                    border border-gray-200 p-5">

                    <div className="w-11 h-11 bg-green-100
                      text-green-600 rounded-xl
                      flex items-center justify-center">

                      <CheckCircle2 size={22} />

                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Delivered
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      8
                    </h3>

                  </div>


                  {/* Processing */}

                  <div className="bg-white rounded-2xl
                    border border-gray-200 p-5">

                    <div className="w-11 h-11 bg-orange-100
                      text-orange-600 rounded-xl
                      flex items-center justify-center">

                      <Clock3 size={22} />

                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Processing
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      2
                    </h3>

                  </div>


                  {/* Wishlist */}

                  <div className="bg-white rounded-2xl
                    border border-gray-200 p-5">

                    <div className="w-11 h-11 bg-pink-100
                      text-pink-600 rounded-xl
                      flex items-center justify-center">

                      <Heart size={22} />

                    </div>

                    <p className="text-gray-500 text-sm mt-4">
                      Wishlist
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      5
                    </h3>

                  </div>

                </div>


                {/* ================= RECENT ORDERS ================= */}

                <div className="bg-white rounded-2xl
                  border border-gray-200 mt-8 overflow-hidden">

                  <div className="p-6 flex items-center
                    justify-between border-b border-gray-200">

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        Recent Orders
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Your latest purchases
                      </p>

                    </div>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className="hidden sm:flex items-center gap-1
                        text-blue-600 font-medium text-sm"
                    >
                      View All
                      <ChevronRight size={17} />
                    </button>

                  </div>


                  <div className="divide-y divide-gray-100">

                    {orders.map((order) => (

                      <div
                        key={order.id}
                        className="p-5 flex flex-col md:flex-row
                        md:items-center md:justify-between gap-4"
                      >

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 bg-gray-100
                            rounded-xl flex items-center
                            justify-center">

                            <Package
                              size={21}
                              className="text-gray-600"
                            />

                          </div>

                          <div>

                            <h3 className="font-semibold text-gray-900">
                              Order #{order.id}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {order.date} • {order.items} item
                              {order.items > 1 ? "s" : ""}
                            </p>

                          </div>

                        </div>


                        <div className="flex items-center
                          justify-between md:justify-end gap-5">

                          <span className="font-bold text-gray-900">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>

                          <span className={`inline-flex
                            items-center gap-1.5 px-3 py-1.5
                            rounded-full text-xs font-semibold
                            ${getStatusStyle(order.status)}`}
                          >

                            {getStatusIcon(order.status)}

                            {order.status}

                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>


                {/* ================= QUICK ACTIONS ================= */}

                <div className="mt-8">

                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <Link
                      to="/products"
                      className="bg-white border border-gray-200
                        rounded-xl p-5 hover:shadow-md
                        transition group"
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
                      onClick={() => setActiveTab("profile")}
                      className="bg-white border border-gray-200
                        rounded-xl p-5 hover:shadow-md
                        transition text-left"
                    >

                      <User
                        size={23}
                        className="text-purple-600"
                      />

                      <h3 className="font-semibold text-gray-900 mt-3">
                        Edit Profile
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Update your account
                      </p>

                    </button>


                    <button
                      onClick={() => setActiveTab("address")}
                      className="bg-white border border-gray-200
                        rounded-xl p-5 hover:shadow-md
                        transition text-left"
                    >

                      <MapPin
                        size={23}
                        className="text-green-600"
                      />

                      <h3 className="font-semibold text-gray-900 mt-3">
                        Manage Address
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Update delivery address
                      </p>

                    </button>

                  </div>

                </div>

              </div>
            )}


            {/* ================= ORDERS ================= */}

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


                <div className="space-y-4">

                  {orders.map((order) => (

                    <div
                      key={order.id}
                      className="bg-white border border-gray-200
                      rounded-2xl p-6"
                    >

                      <div className="flex flex-col md:flex-row
                        md:items-center md:justify-between gap-4">

                        <div>

                          <p className="text-sm text-gray-500">
                            Order ID
                          </p>

                          <h2 className="font-bold text-lg text-gray-900">
                            #{order.id}
                          </h2>

                          <p className="text-sm text-gray-500 mt-1">
                            Placed on {order.date}
                          </p>

                        </div>


                        <div className="flex items-center gap-5">

                          <div className="text-right">

                            <p className="text-sm text-gray-500">
                              Total
                            </p>

                            <p className="font-bold text-gray-900">
                              ₹{order.total.toLocaleString("en-IN")}
                            </p>

                          </div>

                          <span className={`inline-flex
                            items-center gap-1.5 px-3 py-2
                            rounded-full text-xs font-semibold
                            ${getStatusStyle(order.status)}`}
                          >

                            {getStatusIcon(order.status)}

                            {order.status}

                          </span>

                        </div>

                      </div>


                      {/* Order Progress */}

                      <div className="mt-6 pt-5
                        border-t border-gray-100">

                        <div className="grid grid-cols-3 gap-2">

                          <div className="text-center">

                            <div className="w-9 h-9 mx-auto
                              bg-green-100 text-green-600
                              rounded-full flex items-center
                              justify-center">

                              <CheckCircle2 size={18} />

                            </div>

                            <p className="text-xs font-medium
                              text-gray-700 mt-2">
                              Ordered
                            </p>

                          </div>


                          <div className="text-center">

                            <div className={`w-9 h-9 mx-auto
                              rounded-full flex items-center
                              justify-center ${
                              order.status !== "Processing"
                                ? "bg-green-100 text-green-600"
                                : "bg-orange-100 text-orange-600"
                            }`}>

                              <Truck size={18} />

                            </div>

                            <p className="text-xs font-medium
                              text-gray-700 mt-2">
                              Shipped
                            </p>

                          </div>


                          <div className="text-center">

                            <div className={`w-9 h-9 mx-auto
                              rounded-full flex items-center
                              justify-center ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}>

                              <CheckCircle2 size={18} />

                            </div>

                            <p className="text-xs font-medium
                              text-gray-700 mt-2">
                              Delivered
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>
            )}


            {/* ================= PROFILE ================= */}

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


                <div className="bg-white border border-gray-200
                  rounded-2xl p-6">

                  <div className="flex items-center gap-5
                    pb-6 border-b border-gray-200">

                    <div className="w-20 h-20 rounded-full
                      bg-blue-100 text-blue-600
                      flex items-center justify-center
                      text-3xl font-bold">

                      {customer.name.charAt(0)}

                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        {customer.name}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        SmartMart member since {customer.memberSince}
                      </p>

                    </div>

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2
                    gap-6 mt-6">

                    <div>

                      <label className="text-sm font-medium
                        text-gray-500">
                        Full Name
                      </label>

                      <div className="mt-2 px-4 py-3
                        border border-gray-200
                        rounded-xl bg-gray-50">
                        {customer.name}
                      </div>

                    </div>


                    <div>

                      <label className="text-sm font-medium
                        text-gray-500">
                        Email Address
                      </label>

                      <div className="mt-2 px-4 py-3
                        border border-gray-200
                        rounded-xl bg-gray-50">
                        {customer.email}
                      </div>

                    </div>


                    <div>

                      <label className="text-sm font-medium
                        text-gray-500">
                        Phone Number
                      </label>

                      <div className="mt-2 px-4 py-3
                        border border-gray-200
                        rounded-xl bg-gray-50">
                        {customer.phone}
                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="mt-6 px-6 py-3
                    bg-blue-600 text-white
                    rounded-xl font-semibold
                    hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>

                </div>

              </div>
            )}


            {/* ================= ADDRESS ================= */}

            {activeTab === "address" && (
              <div>

                <div className="mb-8">

                  <h1 className="text-3xl font-bold text-gray-900">
                    Saved Address
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Manage your delivery addresses.
                  </p>

                </div>


                <div className="bg-white border border-gray-200
                  rounded-2xl p-6">

                  <div className="flex items-start
                    justify-between gap-4">

                    <div className="flex gap-4">

                      <div className="w-11 h-11 bg-blue-100
                        text-blue-600 rounded-xl
                        flex items-center justify-center shrink-0">

                        <MapPin size={21} />

                      </div>

                      <div>

                        <div className="flex items-center gap-2">

                          <h2 className="font-bold text-gray-900">
                            Home
                          </h2>

                          <span className="text-xs font-semibold
                            bg-green-100 text-green-700
                            px-2 py-1 rounded-full">
                            Default
                          </span>

                        </div>

                        <p className="text-gray-600 mt-2 leading-relaxed">
                          Jit Ojha<br />
                          123 Main Street<br />
                          Dehradun, Uttarakhand<br />
                          248001
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                          Phone: +91 98765 43210
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="text-blue-600 text-sm
                      font-medium hover:text-blue-700"
                    >
                      Edit
                    </button>

                  </div>

                </div>


                <button
                  type="button"
                  className="mt-5 px-6 py-3
                  border border-blue-600
                  text-blue-600 rounded-xl
                  font-semibold hover:bg-blue-50 transition"
                >
                  + Add New Address
                </button>

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}

export default CustomerDashboard;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Store,
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
  Boxes,
  Search,
  RefreshCw,
  ChevronRight,
  Save,
} from "lucide-react";

const API = "http://localhost:8080/api";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

function SellerDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [productError, setProductError] = useState("");
  const [orderError, setOrderError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [profileEdit, setProfileEdit] = useState(false);

  const [profile, setProfile] = useState({
    storeName: "",
    phone: "",
  });

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getStoredUser = () => {
  try {
    const stored =
      sessionStorage.getItem("smartmartUser") ||
      localStorage.getItem("smartmartUser");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Unable to read logged-in user:", error);

    localStorage.removeItem("smartmartUser");
    sessionStorage.removeItem("smartmartUser");

    return null;
  }
};

  const user = getStoredUser();

  const userRole = String(user?.role || "").toUpperCase();

  const sellerId = user?.id;

  const seller = {
    id: sellerId,
    name: user?.storeName || user?.name || "My Store",
    owner: user?.name || "Seller",
    email: user?.email || "seller@example.com",
    phone: user?.phone || "Not available",
    joined: user?.createdAt
      ? new Date(user.createdAt).getFullYear()
      : "2026",
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!sellerId || user?.role !== "SELLER") {
      navigate("/login", { replace: true });
      return;
    }

    setProfile({
      storeName: user?.storeName || user?.name || "",
      phone: user?.phone || "",
    });

    fetchProducts();
    fetchOrders();
  }, [sellerId]);

  // =====================================================
  // FETCH SELLER PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    if (!sellerId) {
      return;
    }

    try {
      setLoadingProducts(true);
      setProductError("");

      console.log("Fetching products for seller:", sellerId);

      const response = await axios.get(
        `${API}/products/seller/${sellerId}`
      );

      console.log("Seller products:", response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        setProductError("Invalid product data received from server.");
      }
    } catch (error) {
      console.error("Fetch seller products error:", error);

      setProducts([]);

      setProductError(
        error.response?.data?.message ||
          "Unable to load your products."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // =====================================================
  // FETCH SELLER ORDERS
  // =====================================================

  const fetchOrders = async () => {
    if (!sellerId) {
      return;
    }

    try {
      setLoadingOrders(true);
      setOrderError("");

      console.log("Fetching orders for seller:", sellerId);

      const response = await axios.get(
        `${API}/orders/seller/${sellerId}`
      );

      console.log("Seller orders:", response.data);

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
        setOrderError("Invalid order data received from server.");
      }
    } catch (error) {
      console.error("Fetch seller orders error:", error);

      setOrders([]);

      setOrderError(
        error.response?.data?.message ||
          "Unable to load seller orders."
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  // =====================================================
  // REFRESH EVERYTHING
  // =====================================================

  const refreshDashboard = async () => {
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
    ]);
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        [
          product.name,
          product.description,
          product.category,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [
    products,
    search,
    categoryFilter,
  ]);

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = String(
        order.orderStatus ||
          order.status ||
          "PLACED"
      ).toUpperCase();

      return (
        orderFilter === "All" ||
        status === orderFilter
      );
    });
  }, [orders, orderFilter]);

  // =====================================================
  // DASHBOARD METRICS
  // =====================================================

  const metrics = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) =>
        sum + Number(product.stock || 0),
      0
    );

    const lowStock = products.filter(
      (product) =>
        Number(product.stock || 0) <= 5
    ).length;

    const revenue = orders.reduce(
      (sum, order) =>
        sum + Number(order.subtotal || 0),
      0
    );

    const units = orders.reduce(
      (sum, order) =>
        sum + Number(order.quantity || 0),
      0
    );

    const customers = new Set(
      orders
        .map(
          (order) =>
            order.orderEmail ||
            order.email
        )
        .filter(Boolean)
    ).size;

    const deliveredOrders = orders.filter(
      (order) =>
        String(
          order.orderStatus ||
            order.status ||
            ""
        ).toUpperCase() === "DELIVERED"
    ).length;

    const pendingOrders = orders.filter(
      (order) => {
        const status = String(
          order.orderStatus ||
            order.status ||
            "PLACED"
        ).toUpperCase();

        return [
          "PLACED",
          "PROCESSING",
          "SHIPPED",
        ].includes(status);
      }
    ).length;

    return {
      totalStock,
      lowStock,
      revenue,
      units,
      customers,
      deliveredOrders,
      pendingOrders,
    };
  }, [products, orders]);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // START ADD PRODUCT
  // =====================================================

  const startAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setActiveTab("add-product");
    setMobileMenu(false);
  };

  // =====================================================
  // START EDIT PRODUCT
  // =====================================================

  const startEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      description: product.description || "",
    });

    setActiveTab("add-product");
    setMobileMenu(false);
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const saveProduct = async (event) => {
    event.preventDefault();

    if (!sellerId) {
      alert("Seller information not found. Please login again.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      alert("Please enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      image: formData.image.trim(),
      stock: Number(formData.stock),
      sellerId: Number(sellerId),
    };

    try {
      setSavingProduct(true);

      if (editingId) {
        const response = await axios.put(
          `${API}/products/${editingId}`,
          payload
        );

        setProducts((current) =>
          current.map((product) =>
            product.id === editingId
              ? response.data
              : product
          )
        );

        alert("Product updated successfully!");
      } else {
        const response = await axios.post(
          `${API}/products`,
          payload
        );

        setProducts((current) => [
          response.data,
          ...current,
        ]);

        alert("Product added successfully!");
      }

      setFormData(emptyForm);
      setEditingId(null);
      setActiveTab("products");
    } catch (error) {
      console.error("Save product error:", error);

      alert(
        error.response?.data?.message ||
          "Could not save product. Check the backend."
      );
    } finally {
      setSavingProduct(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Delete this product permanently?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API}/products/${id}`
      );

      setProducts((current) =>
        current.filter(
          (product) => product.id !== id
        )
      );

      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete product error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    if (!orderId) {
      return;
    }

    try {
      setUpdatingOrder(orderId);

      console.log(
        "Updating order:",
        orderId,
        "Status:",
        status
      );

      await axios.put(
        `${API}/orders/${orderId}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    [
      "smartmartUser",
      "token",
      "user",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    window.dispatchEvent(
      new Event("userLogout")
    );

    navigate("/login");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      storeName: profile.storeName.trim(),
      phone: profile.phone.trim(),
    };

    localStorage.setItem(
      "smartmartUser",
      JSON.stringify(updatedUser)
    );

    setProfileEdit(false);

    window.location.reload();
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const statusClass = (status) => {
    const value = String(
      status || "PLACED"
    ).toUpperCase();

    switch (value) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "SHIPPED":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "PROCESSING":
        return "bg-amber-100 text-amber-700";

      case "PLACED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // STOCK HELPERS
  // =====================================================

  const stockLabel = (stock) => {
    const value = Number(stock || 0);

    if (value <= 0) {
      return "Out of stock";
    }

    if (value <= 5) {
      return "Low stock";
    }

    return "In stock";
  };

  const stockClass = (stock) => {
    const value = Number(stock || 0);

    if (value <= 0) {
      return "text-red-600";
    }

    if (value <= 5) {
      return "text-amber-600";
    }

    return "text-green-600";
  };

  // =====================================================
  // SIDEBAR MENU
  // =====================================================

  const menuItems = [
    [
      "overview",
      "Overview",
      LayoutDashboard,
    ],
    [
      "products",
      "My Products",
      Package,
    ],
    [
      "add-product",
      editingId
        ? "Edit Product"
        : "Add Product",
      Plus,
    ],
    [
      "orders",
      "Orders",
      ShoppingBag,
    ],
    [
      "sales",
      "Sales & Analytics",
      BarChart3,
    ],
    [
      "profile",
      "Seller Profile",
      User,
    ],
  ];

  const go = (tab) => {
    setActiveTab(tab);
    setMobileMenu(false);
  };

  // =====================================================
  // NO SELLER
  // =====================================================

  if (!sellerId) {
    return null;
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Store
              className="text-white"
              size={21}
            />
          </div>

          <div>
            <p className="font-bold">
              SmartMart
            </p>

            <p className="text-xs text-gray-500">
              Seller Center
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            setMobileMenu((current) => !current)
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

      </header>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside
            className={`${
              mobileMenu
                ? "block"
                : "hidden"
            } lg:block`}
          >

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden lg:sticky lg:top-8">

              {/* SELLER INFO */}

              <div className="p-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white">

                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  <Store size={29} />
                </div>

                <h2 className="font-bold text-lg truncate">
                  {seller.name}
                </h2>

                <p className="text-blue-100 text-sm mt-1 truncate">
                  {seller.owner}
                </p>

                <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
                  <CheckCircle2 size={13} />
                  Verified Seller
                </span>

              </div>

              {/* NAVIGATION */}

              <nav className="p-3">

                {menuItems.map(
                  ([id, label, Icon]) => (
                    <button
                      key={id}
                      onClick={() =>
                        go(id)
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left ${
                        activeTab === id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >

                      <Icon size={19} />

                      <span className="font-medium">
                        {label}
                      </span>

                      {id === "products" && (
                        <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {products.length}
                        </span>
                      )}

                      {id === "orders" && (
                        <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {orders.length}
                        </span>
                      )}

                    </button>
                  )
                )}

                <div className="border-t my-3" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut size={19} />

                  <span className="font-medium">
                    Logout
                  </span>
                </button>

              </nav>

            </div>

          </aside>

          {/* =================================================
              CONTENT
          ================================================= */}

          <main className="lg:col-span-3 min-w-0">

            {/* PRODUCT ERROR */}

            {productError && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">

                <AlertTriangle
                  size={20}
                  className="mt-0.5"
                />

                <div className="flex-1">

                  <p className="font-semibold">
                    Could not load products
                  </p>

                  <p className="text-sm mt-1">
                    {productError}
                  </p>

                </div>

                <button
                  className="p-2 hover:bg-red-100 rounded-lg"
                  onClick={fetchProducts}
                >
                  <RefreshCw size={18} />
                </button>

              </div>
            )}

            {/* ORDER ERROR */}

            {orderError && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-700">

                <AlertTriangle
                  size={20}
                  className="mt-0.5"
                />

                <div className="flex-1">

                  <p className="font-semibold">
                    Could not load orders
                  </p>

                  <p className="text-sm mt-1">
                    {orderError}
                  </p>

                </div>

                <button
                  className="p-2 hover:bg-orange-100 rounded-lg"
                  onClick={fetchOrders}
                >
                  <RefreshCw size={18} />
                </button>

              </div>
            )}

            {/* =================================================
                OVERVIEW
            ================================================= */}

            {activeTab === "overview" && (
              <Overview
                seller={seller}
                metrics={metrics}
                products={products}
                orders={orders}
                loading={
                  loadingProducts ||
                  loadingOrders
                }
                go={go}
                stockClass={stockClass}
                stockLabel={stockLabel}
              />
            )}

            {/* =================================================
                PRODUCTS
            ================================================= */}

            {activeTab === "products" && (
              <ProductsView
                products={filteredProducts}
                categories={categories}
                search={search}
                setSearch={setSearch}
                categoryFilter={
                  categoryFilter
                }
                setCategoryFilter={
                  setCategoryFilter
                }
                loading={loadingProducts}
                startAdd={startAdd}
                startEdit={startEdit}
                deleteProduct={
                  deleteProduct
                }
                view={setSelectedProduct}
                stockClass={stockClass}
                stockLabel={stockLabel}
                refresh={fetchProducts}
              />
            )}

            {/* =================================================
                ADD / EDIT PRODUCT
            ================================================= */}

            {activeTab === "add-product" && (
              <ProductForm
                formData={formData}
                handleInputChange={
                  handleInputChange
                }
                saveProduct={saveProduct}
                saving={savingProduct}
                editingId={editingId}
                cancel={() => {
                  setEditingId(null);
                  setFormData(emptyForm);
                  go("products");
                }}
              />
            )}

            {/* =================================================
                ORDERS
            ================================================= */}

            {activeTab === "orders" && (
              <OrdersView
                orders={filteredOrders}
                filter={orderFilter}
                setFilter={setOrderFilter}
                loading={loadingOrders}
                refresh={fetchOrders}
                statusClass={statusClass}
                updatingOrder={
                  updatingOrder
                }
                updateOrderStatus={
                  updateOrderStatus
                }
              />
            )}

            {/* =================================================
                SALES
            ================================================= */}

            {activeTab === "sales" && (
              <SalesView
                orders={orders}
                products={products}
                metrics={metrics}
              />
            )}

            {/* =================================================
                PROFILE
            ================================================= */}

            {activeTab === "profile" && (
              <ProfileView
                seller={seller}
                profile={profile}
                setProfile={setProfile}
                edit={profileEdit}
                setEdit={setProfileEdit}
                save={saveProfile}
              />
            )}

          </main>

        </div>

      </div>

      {/* =================================================
          PRODUCT MODAL
      ================================================= */}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          close={() =>
            setSelectedProduct(null)
          }
          startEdit={startEdit}
        />
      )}

    </div>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

      <div>

        <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
          {eyebrow}
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-1">
          {title}
        </h1>

        <p className="text-gray-500 mt-2">
          {description}
        </p>

      </div>

      {action}

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  iconClass = "text-blue-600",
  positive = true,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div
          className={`w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center ${iconClass}`}
        >
          <Icon size={23} />
        </div>

        {note && (
          <span
            className={`text-xs font-semibold ${
              positive
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {note}
          </span>
        )}

      </div>

      <p className="text-sm text-gray-500 mt-5">
        {label}
      </p>

      <h2 className="text-2xl font-bold mt-1">
        {value}
      </h2>

    </div>
  );
}

// =====================================================
// OVERVIEW
// =====================================================

function Overview({
  seller,
  metrics,
  products,
  orders,
  loading,
  go,
  stockClass,
  stockLabel,
}) {
  const recent = [...orders]
    .sort((a, b) => {
      const dateA = a.orderDate
        ? new Date(a.orderDate).getTime()
        : Number(a.orderId || a.id || 0);

      const dateB = b.orderDate
        ? new Date(b.orderDate).getTime()
        : Number(b.orderId || b.id || 0);

      return dateB - dateA;
    })
    .slice(0, 5);

  const lowStockProducts = products
    .filter(
      (product) =>
        Number(product.stock || 0) <= 5
    )
    .slice(0, 4);

  return (
    <div>

      <SectionHeader
        eyebrow="Seller Center"
        title={`Welcome, ${seller.name}! 👋`}
        description="Manage your store, products, orders and sales from one place."
        action={
          <button
            onClick={() =>
              go("add-product")
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Product
          </button>
        }
      />

      {/* METRICS */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          icon={Package}
          label="Products"
          value={products.length}
          note="Live catalog"
        />

        <StatCard
          icon={Boxes}
          label="Total Stock"
          value={metrics.totalStock}
          note={`${metrics.lowStock} low stock`}
          iconClass="text-purple-600"
          positive={
            metrics.lowStock === 0
          }
        />

        <StatCard
          icon={ShoppingBag}
          label="Units Sold"
          value={metrics.units}
          note={`${orders.length} order items`}
          iconClass="text-orange-600"
        />

        <StatCard
          icon={IndianRupee}
          label="Sales"
          value={`₹${metrics.revenue.toLocaleString(
            "en-IN"
          )}`}
          note="Recorded sales"
          iconClass="text-green-600"
        />

      </div>

      {/* ORDER SUMMARY */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <MiniStat
          label="Total Order Items"
          value={orders.length}
        />

        <MiniStat
          label="Pending"
          value={metrics.pendingOrders}
        />

        <MiniStat
          label="Delivered"
          value={metrics.deliveredOrders}
        />

        <MiniStat
          label="Customers"
          value={metrics.customers}
        />

      </div>

      {/* RECENT ORDERS + INVENTORY */}

      <div className="grid xl:grid-cols-3 gap-6 mt-6">

        {/* RECENT ORDERS */}

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="p-5 border-b flex items-center justify-between">

            <div>
              <h2 className="font-bold text-lg">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest orders containing your products
              </p>
            </div>

            <button
              onClick={() =>
                go("orders")
              }
              className="text-sm font-semibold text-blue-600 inline-flex items-center gap-1"
            >
              View all
              <ChevronRight size={16} />
            </button>

          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading orders…
            </div>
          ) : recent.length === 0 ? (
            <Empty
              title="No orders yet"
              text="Orders for your products will appear here."
            />
          ) : (
            <div className="divide-y">

              {recent.map((order, index) => (
                <OrderRow
                  key={`${order.orderId}-${order.id}-${index}`}
                  item={order}
                  statusClass={getStatusClass}
                />
              ))}

            </div>
          )}

        </div>

        {/* INVENTORY */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold text-lg">
                Inventory Alerts
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Products needing attention
              </p>

            </div>

            <AlertTriangle
              className={
                lowStockProducts.length
                  ? "text-amber-500"
                  : "text-green-500"
              }
            />

          </div>

          {lowStockProducts.length ? (
            <div className="mt-5 space-y-3">

              {lowStockProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >

                    <div className="w-12 h-12 rounded-lg bg-white border overflow-hidden flex items-center justify-center">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package
                          size={19}
                          className="text-gray-400"
                        />
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="font-medium truncate">
                        {product.name}
                      </p>

                      <p
                        className={`text-sm font-semibold ${stockClass(
                          product.stock
                        )}`}
                      >
                        {stockLabel(
                          product.stock
                        )}{" "}
                        · {product.stock}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="mt-8 text-center">

              <CheckCircle2 className="mx-auto text-green-500" />

              <p className="font-semibold mt-3">
                Inventory looks good
              </p>

              <p className="text-sm text-gray-500 mt-1">
                No products are low on stock.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* STORE HEALTH */}

      <div className="mt-6 bg-blue-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <p className="text-blue-100 text-sm">
            Store health
          </p>

          <h2 className="text-xl font-bold mt-1">
            Keep your catalog fresh and inventory updated.
          </h2>

        </div>

        <button
          onClick={() =>
            go("products")
          }
          className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold"
        >
          Manage Products
        </button>

      </div>

    </div>
  );
}

// =====================================================
// MINI STAT
// =====================================================

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
        {label}
      </p>

      <p className="text-xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}

// =====================================================
// PRODUCTS VIEW
// =====================================================

function ProductsView({
  products,
  categories,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  loading,
  startAdd,
  startEdit,
  deleteProduct,
  view,
  stockClass,
  stockLabel,
  refresh,
}) {
  return (
    <div>

      <SectionHeader
        eyebrow="Catalog"
        title="My Products"
        description="Add, edit, inspect and manage everything you sell."
        action={
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            <Plus size={18} />
            Add Product
          </button>
        }
      />

      {/* SEARCH */}

      <div className="bg-white border rounded-2xl p-4 mb-5 flex flex-col md:flex-row gap-3">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          className="px-4 py-3 border rounded-xl bg-white"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        <button
          onClick={refresh}
          className="px-4 py-3 border rounded-xl hover:bg-gray-50"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>

      </div>

      {/* PRODUCTS */}

      {loading ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-gray-500">
          Loading products…
        </div>
      ) : products.length === 0 ? (
        <Empty
          title="No products found"
          text="Add your first product or change your filters."
          action={
            <button
              onClick={startAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Product
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              startEdit={startEdit}
              deleteProduct={deleteProduct}
              view={view}
              stockClass={stockClass}
              stockLabel={stockLabel}
            />
          ))}

        </div>
      )}

    </div>
  );
}

// =====================================================
// PRODUCT CARD
// =====================================================

function ProductCard({
  product,
  startEdit,
  deleteProduct,
  view,
  stockClass,
  stockLabel,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">

      <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <Package
            size={44}
            className="text-gray-300"
          />
        )}

        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 ${stockClass(
            product.stock
          )}`}
        >
          {stockLabel(product.stock)}
        </span>

      </div>

      <div className="p-4">

        <div className="flex items-start justify-between gap-2">

          <div className="min-w-0">

            <p className="text-xs text-blue-600 font-semibold">
              {product.category}
            </p>

            <h3 className="font-bold mt-1 truncate">
              {product.name}
            </h3>

          </div>

          <p className="font-bold whitespace-nowrap">
            ₹
            {Number(
              product.price || 0
            ).toLocaleString("en-IN")}
          </p>

        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-10">
          {product.description ||
            "No description added."}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">

          <span className="text-sm text-gray-500">
            Stock:{" "}
            <b
              className={stockClass(
                product.stock
              )}
            >
              {product.stock}
            </b>
          </span>

          <div className="flex gap-1">

            <button
              onClick={() =>
                view(product)
              }
              className="p-2 rounded-lg hover:bg-gray-100"
              title="View"
            >
              <Eye size={17} />
            </button>

            <button
              onClick={() =>
                startEdit(product)
              }
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
              title="Edit"
            >
              <Edit size={17} />
            </button>

            <button
              onClick={() =>
                deleteProduct(product.id)
              }
              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
              title="Delete"
            >
              <Trash2 size={17} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// PRODUCT FORM
// =====================================================

function ProductForm({
  formData,
  handleInputChange,
  saveProduct,
  saving,
  editingId,
  cancel,
}) {
  return (
    <div>

      <SectionHeader
        eyebrow="Catalog"
        title={
          editingId
            ? "Edit Product"
            : "Add Product"
        }
        description={
          editingId
            ? "Update the details of your existing product."
            : "Publish a new product to your SmartMart catalog."
        }
      />

      <form
        onSubmit={saveProduct}
        className="bg-white border rounded-2xl p-5 md:p-7"
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Field
            label="Product Name"
            required
          >
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. Wireless Headphones"
            />
          </Field>

          <Field
            label="Category"
            required
          >
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">
                Select category
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Home">
                Home
              </option>

              <option value="Beauty">
                Beauty
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Books">
                Books
              </option>

              <option value="Grocery">
                Grocery
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </Field>

          <Field
            label="Price (₹)"
            required
          >
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="999"
            />
          </Field>

          <Field
            label="Stock Quantity"
            required
          >
            <input
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              required
              placeholder="50"
            />
          </Field>

          <Field
            label="Image URL"
            wide
          >
            <input
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/product.jpg"
            />
          </Field>

          <Field
            label="Description"
            wide
          >
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              placeholder="Describe your product…"
            />
          </Field>

        </div>

        {/* IMAGE PREVIEW */}

        {formData.image && (
          <div className="mt-5">

            <p className="text-sm font-semibold mb-2">
              Image preview
            </p>

            <img
              src={formData.image}
              alt="Preview"
              className="w-40 h-40 rounded-xl object-cover border"
              onError={(event) => {
                event.currentTarget.alt =
                  "Image URL could not be loaded";
              }}
            />

          </div>
        )}

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7 pt-5 border-t">

          <button
            type="button"
            onClick={cancel}
            className="px-5 py-3 border rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            {editingId
              ? "Update Product"
              : "Publish Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

// =====================================================
// FIELD
// =====================================================

function Field({
  label,
  required,
  wide,
  children,
}) {
  return (
    <label
      className={
        wide ? "md:col-span-2" : ""
      }
    >
      <span className="block text-sm font-semibold mb-2">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

// =====================================================
// ORDERS VIEW
// =====================================================

function OrdersView({
  orders,
  filter,
  setFilter,
  loading,
  refresh,
  statusClass,
  updatingOrder,
  updateOrderStatus,
}) {
  const statuses = [
    "All",
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div>

      <SectionHeader
        eyebrow="Fulfilment"
        title="Orders"
        description="Track and update orders containing your products."
        action={
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-3 border bg-white rounded-xl disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        }
      />

      {/* FILTERS */}

      <div className="flex flex-wrap gap-2 mb-5">

        {statuses.map((status) => (
          <button
            key={status}
            onClick={() =>
              setFilter(status)
            }
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {status}
          </button>
        ))}

      </div>

      {/* ORDERS TABLE */}

      <div className="bg-white border rounded-2xl overflow-hidden">

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw
              size={25}
              className="mx-auto animate-spin mb-3"
            />
            Loading seller orders…
          </div>
        ) : orders.length === 0 ? (
          <Empty
            title="No matching orders"
            text="Orders containing your products will appear here after customers place them."
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">

                <tr>

                  <th className="p-4">
                    Order
                  </th>

                  <th className="p-4">
                    Date
                  </th>

                  <th className="p-4">
                    Product
                  </th>

                  <th className="p-4">
                    Customer
                  </th>

                  <th className="p-4">
                    Qty
                  </th>

                  <th className="p-4">
                    Amount
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Update
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {orders.map(
                  (order, index) => {
                    const orderId =
                      order.orderId ||
                      order.id;

                    const status = String(
                      order.orderStatus ||
                        order.status ||
                        "PLACED"
                    ).toUpperCase();

                    return (
                      <tr
                        key={`${orderId}-${order.id}-${index}`}
                        className="hover:bg-gray-50"
                      >

                        {/* ORDER ID */}

                        <td className="p-4 font-semibold">
                          #
                          {orderId || "—"}
                        </td>

                        {/* DATE */}

                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatOrderDate(
                            order.orderDate
                          )}
                        </td>

                        {/* PRODUCT */}

                        <td className="p-4">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">

                              {order.productImage ? (
                                <img
                                  src={
                                    order.productImage
                                  }
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <Package
                                  size={18}
                                  className="text-gray-400"
                                />
                              )}

                            </div>

                            <span className="font-medium">
                              {order.productName ||
                                "Product"}
                            </span>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td className="p-4 text-sm">

                          <p className="font-medium">
                            {order.orderName ||
                              [
                                order.firstName,
                                order.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ") ||
                              "Customer"}
                          </p>

                          <p className="text-gray-500 mt-1">
                            {order.orderEmail ||
                              order.email ||
                              ""}
                          </p>

                        </td>

                        {/* QUANTITY */}

                        <td className="p-4 font-medium">
                          {order.quantity || 0}
                        </td>

                        {/* AMOUNT */}

                        <td className="p-4 font-bold whitespace-nowrap">
                          ₹
                          {Number(
                            order.subtotal || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="p-4">

                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${statusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </td>

                        {/* UPDATE */}

                        <td className="p-4">

                          <select
                            disabled={
                              !orderId ||
                              updatingOrder ===
                                orderId
                            }
                            value={status}
                            onChange={(event) =>
                              updateOrderStatus(
                                orderId,
                                event.target.value
                              )
                            }
                            className="border rounded-lg px-2 py-2 text-sm bg-white disabled:opacity-50"
                          >

                            <option value="PLACED">
                              PLACED
                            </option>

                            <option value="PROCESSING">
                              PROCESSING
                            </option>

                            <option value="SHIPPED">
                              SHIPPED
                            </option>

                            <option value="DELIVERED">
                              DELIVERED
                            </option>

                            <option value="CANCELLED">
                              CANCELLED
                            </option>

                          </select>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// ORDER ROW
// =====================================================

function OrderRow({
  item,
  statusClass,
}) {
  const status =
    item.orderStatus ||
    item.status ||
    "PLACED";

  return (
    <div className="p-4 flex items-center gap-4">

      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <ShoppingBag
          size={17}
          className="text-gray-500"
        />
      </div>

      <div className="min-w-0 flex-1">

        <p className="font-semibold truncate">
          {item.productName ||
            "Product"}
        </p>

        <p className="text-xs text-gray-500">
          Order #
          {item.orderId ||
            item.id ||
            "—"}{" "}
          · Qty {item.quantity || 0}
        </p>

        {item.orderName && (
          <p className="text-xs text-gray-500 mt-1">
            Customer: {item.orderName}
          </p>
        )}

      </div>

      <div className="text-right">

        <p className="font-bold">
          ₹
          {Number(
            item.subtotal || 0
          ).toLocaleString("en-IN")}
        </p>

        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold ${statusClass(
            status
          )}`}
        >
          {status}
        </span>

      </div>

    </div>
  );
}

// =====================================================
// SALES ANALYTICS
// =====================================================

function SalesView({
  orders,
  products,
  metrics,
}) {
  const byProduct = products
    .map((product) => {
      const productOrders = orders.filter(
        (order) =>
          Number(order.productId) ===
          Number(product.id)
      );

      return {
        name: product.name,
        sales: productOrders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.subtotal || 0
            ),
          0
        ),
        units: productOrders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.quantity || 0
            ),
          0
        ),
      };
    })
    .filter((item) => item.sales > 0)
    .sort(
      (a, b) =>
        b.sales - a.sales
    )
    .slice(0, 6);

  const max = Math.max(
    ...byProduct.map(
      (item) => item.sales
    ),
    1
  );

  const statusCounts = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ].map((status) => [
    status,
    orders.filter(
      (order) =>
        String(
          order.orderStatus ||
            order.status ||
            "PLACED"
        ).toUpperCase() ===
        status
    ).length,
  ]);

  return (
    <div>

      <SectionHeader
        eyebrow="Performance"
        title="Sales & Analytics"
        description="Analytics calculated from your products and recorded seller order items."
      />

      {/* SALES STATS */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          icon={IndianRupee}
          label="Total Sales"
          value={`₹${metrics.revenue.toLocaleString(
            "en-IN"
          )}`}
          iconClass="text-green-600"
        />

        <StatCard
          icon={ShoppingBag}
          label="Units Sold"
          value={metrics.units}
          iconClass="text-blue-600"
        />

        <StatCard
          icon={Users}
          label="Customers"
          value={metrics.customers}
          iconClass="text-purple-600"
        />

        <StatCard
          icon={TrendingUp}
          label="Avg. Item Sale"
          value={`₹${
            orders.length
              ? Math.round(
                  metrics.revenue /
                    orders.length
                ).toLocaleString(
                  "en-IN"
                )
              : 0
          }`}
          iconClass="text-orange-600"
        />

      </div>

      <div className="grid xl:grid-cols-2 gap-6 mt-6">

        {/* SALES BY PRODUCT */}

        <div className="bg-white border rounded-2xl p-6">

          <h2 className="font-bold text-lg">
            Sales by Product
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Top products by recorded revenue
          </p>

          <div className="mt-6 space-y-5">

            {byProduct.length ? (
              byProduct.map(
                (item) => (
                  <div key={item.name}>

                    <div className="flex justify-between text-sm mb-2">

                      <div className="min-w-0">

                        <span className="font-medium block truncate mr-4">
                          {item.name}
                        </span>

                        <span className="text-xs text-gray-500">
                          {item.units} unit
                          {item.units !== 1
                            ? "s"
                            : ""}{" "}
                          sold
                        </span>

                      </div>

                      <b className="whitespace-nowrap">
                        ₹
                        {item.sales.toLocaleString(
                          "en-IN"
                        )}
                      </b>

                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${
                            (item.sales /
                              max) *
                            100
                          }%`,
                        }}
                      />

                    </div>

                  </div>
                )
              )
            ) : (
              <Empty
                title="No sales data"
                text="Sales will appear after orders are created."
              />
            )}

          </div>

        </div>

        {/* ORDER STATUS */}

        <div className="bg-white border rounded-2xl p-6">

          <h2 className="font-bold text-lg">
            Order Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current distribution of seller order items
          </p>

          <div className="mt-6 space-y-4">

            {statusCounts.map(
              ([status, count]) => (
                <div
                  key={status}
                  className="flex items-center gap-4"
                >

                  <span className="w-24 text-sm text-gray-600">
                    {status}
                  </span>

                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${
                          orders.length
                            ? (count /
                                orders.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                  <b className="w-8 text-right">
                    {count}
                  </b>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// PROFILE
// =====================================================

function ProfileView({
  seller,
  profile,
  setProfile,
  edit,
  setEdit,
  save,
}) {
  return (
    <div>

      <SectionHeader
        eyebrow="Account"
        title="Seller Profile"
        description="Manage the store details shown in your seller dashboard."
      />

      <div className="bg-white border rounded-2xl p-6 md:p-8">

        {/* STORE HEADER */}

        <div className="flex items-center gap-5 pb-6 border-b">

          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Store size={34} />
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold">
                {seller.name}
              </h2>

              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                Verified
              </span>

            </div>

            <p className="text-gray-500 mt-1">
              Seller since{" "}
              {seller.joined}
            </p>

          </div>

        </div>

        {/* PROFILE DATA */}

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          {edit ? (
            <>
              <Field label="Store Name">
                <input
                  value={profile.storeName}
                  onChange={(event) =>
                    setProfile(
                      (current) => ({
                        ...current,
                        storeName:
                          event.target.value,
                      })
                    )
                  }
                />
              </Field>

              <Field label="Phone">
                <input
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile(
                      (current) => ({
                        ...current,
                        phone:
                          event.target.value,
                      })
                    )
                  }
                />
              </Field>
            </>
          ) : (
            <>
              <Info
                label="Store Name"
                value={seller.name}
              />

              <Info
                label="Owner Name"
                value={seller.owner}
              />

              <Info
                label="Email"
                value={seller.email}
              />

              <Info
                label="Phone"
                value={seller.phone}
              />
            </>
          )}

        </div>

        {/* BUTTONS */}

        <div className="flex gap-3 mt-7">

          {edit ? (
            <>
              <button
                onClick={() =>
                  setEdit(false)
                }
                className="px-5 py-3 border rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold inline-flex gap-2 items-center"
              >
                <Save size={17} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                setEdit(true)
              }
              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold inline-flex gap-2 items-center"
            >
              <Edit size={17} />
              Edit Store Profile
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

// =====================================================
// INFO
// =====================================================

function Info({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-sm font-semibold text-gray-500">
        {label}
      </p>

      <div className="mt-2 px-4 py-3 border rounded-xl bg-gray-50">
        {value || "Not available"}
      </div>

    </div>
  );
}

// =====================================================
// PRODUCT MODAL
// =====================================================

function ProductModal({
  product,
  close,
  startEdit,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center"
      onMouseDown={close}
    >

      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="p-5 border-b flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Product Details
          </h2>

          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X />
          </button>

        </div>

        {/* BODY */}

        <div className="p-6 grid md:grid-cols-2 gap-6">

          {/* IMAGE */}

          <div className="h-64 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package
                size={55}
                className="text-gray-300"
              />
            )}

          </div>

          {/* DETAILS */}

          <div>

            <p className="text-sm text-blue-600 font-semibold">
              {product.category}
            </p>

            <h3 className="text-2xl font-bold mt-1">
              {product.name}
            </h3>

            <p className="text-2xl font-bold mt-4">
              ₹
              {Number(
                product.price || 0
              ).toLocaleString("en-IN")}
            </p>

            <p className="text-gray-500 mt-4 leading-6">
              {product.description ||
                "No description."}
            </p>

            <p className="mt-5">
              <b>Stock:</b>{" "}
              {product.stock}
            </p>

            <button
              onClick={() => {
                close();
                startEdit(product);
              }}
              className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <Edit size={17} />
              Edit Product
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// EMPTY
// =====================================================

function Empty({
  title,
  text,
  action,
}) {
  return (
    <div className="p-12 text-center">

      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
        <Package
          size={21}
          className="text-gray-400"
        />
      </div>

      <h3 className="font-bold mt-4">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {text}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}

    </div>
  );
}

// =====================================================
// GLOBAL STATUS HELPER
// =====================================================

function getStatusClass(status) {
  const value = String(
    status || "PLACED"
  ).toUpperCase();

  switch (value) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";

    case "SHIPPED":
      return "bg-blue-100 text-blue-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "PROCESSING":
      return "bg-amber-100 text-amber-700";

    case "PLACED":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

// =====================================================
// DATE FORMATTER
// =====================================================

function formatOrderDate(date) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default SellerDashboard;
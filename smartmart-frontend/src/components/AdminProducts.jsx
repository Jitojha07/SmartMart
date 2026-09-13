import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Package,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Save,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

const API = "http://localhost:8080/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/products`);

      console.log("Products from backend:", response.data);

      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        "Unable to load products. Make sure the Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  // =====================================================
  // SELLER NAME
  // =====================================================

  const getSellerName = (sellerId) => {
    if (!sellerId) {
      return "Admin / Unknown";
    }

    const seller = users.find(
      (user) =>
        Number(user.id) === Number(sellerId) &&
        String(user.role || "").toUpperCase() === "SELLER"
    );

    return seller?.name || seller?.email || `Seller #${sellerId}`;
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

    return uniqueCategories.sort();
  }, [products]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        product.name?.toLowerCase().includes(searchText) ||
        product.description
          ?.toLowerCase()
          .includes(searchText) ||
        product.category
          ?.toLowerCase()
          .includes(searchText) ||
        getSellerName(product.sellerId)
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter, users]);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API}/products/${product.id}`);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert(
        error.response?.data ||
          "Failed to delete product."
      );
    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      price: product.price ?? "",
      stock: product.stock ?? "",
    });
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const saveProduct = async () => {
    if (!editingProduct) {
      return;
    }

    if (!editingProduct.name?.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!editingProduct.category?.trim()) {
      alert("Category is required.");
      return;
    }

    if (
      editingProduct.price === "" ||
      Number(editingProduct.price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      editingProduct.stock === "" ||
      Number(editingProduct.stock) < 0
    ) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: editingProduct.name,
        description: editingProduct.description || "",
        price: Number(editingProduct.price),
        category: editingProduct.category,
        image: editingProduct.image || "",
        stock: Number(editingProduct.stock),
        sellerId: editingProduct.sellerId
          ? Number(editingProduct.sellerId)
          : null,
      };

      const response = await axios.put(
        `${API}/products/${editingProduct.id}`,
        payload
      );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id
            ? response.data
            : product
        )
      );

      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);

      alert(
        error.response?.data ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock ?? 0) <= 5
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.stock ?? 0) <= 0
  ).length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshProducts = async () => {
    await fetchProducts();
    await fetchUsers();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Products Management
          </h2>

          <p className="text-gray-500 mt-1">
            View, edit and manage all SmartMart products
          </p>
        </div>

        <button
          onClick={refreshProducts}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh Products
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {totalProducts}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Stock
          </p>

          <h3 className="text-2xl font-bold text-blue-600 mt-1">
            {totalStock}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <h3 className="text-2xl font-bold text-yellow-600 mt-1">
            {lowStockProducts}
          </h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <h3 className="text-2xl font-bold text-red-600 mt-1">
            {outOfStockProducts}
          </h3>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by product, category or seller..."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="border border-gray-200 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          PRODUCTS TABLE
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              All Products
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} shown
            </p>
          </div>

          <Package
            size={22}
            className="text-gray-400"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={30}
            />

            <p className="text-gray-500 mt-3">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package
              className="mx-auto text-gray-300"
              size={50}
            />

            <h3 className="font-semibold text-gray-900 mt-4">
              No products found
            </h3>

            <p className="text-gray-500 mt-1">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Seller
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stock = Number(
                    product.stock || 0
                  );

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* PRODUCT */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package
                                size={22}
                                className="text-gray-400"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {product.category ||
                            "Uncategorized"}
                        </span>
                      </td>

                      {/* SELLER */}

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {getSellerName(
                            product.sellerId
                          )}
                        </p>

                        {product.sellerId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Seller #{product.sellerId}
                          </p>
                        )}
                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                          <IndianRupee size={14} />
                          {Number(
                            product.price || 0
                          ).toFixed(2)}
                        </div>
                      </td>

                      {/* STOCK */}

                      <td className="px-5 py-4">
                        {stock <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                            <AlertTriangle size={13} />
                            Out of Stock
                          </span>
                        ) : stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                            <AlertTriangle size={13} />
                            {stock} left
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {stock}
                          </span>
                        )}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              openEditModal(product)
                            }
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Edit product"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(product)
                            }
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete product"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* MODAL HEADER */}

            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Product
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Update product information
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingProduct(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editingProduct.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={
                    editingProduct.description || ""
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <input
                  type="text"
                  value={
                    editingProduct.category || ""
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>

                <input
                  type="text"
                  value={editingProduct.image || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">
                  Seller
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {getSellerName(
                    editingProduct.sellerId
                  )}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Seller ID:{" "}
                  {editingProduct.sellerId ||
                    "Not assigned"}
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() =>
                  setEditingProduct(null)
                }
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={saveProduct}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
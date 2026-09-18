import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Store,
  Search,
  RefreshCw,
  Package,
  IndianRupee,
  Users,
} from "lucide-react";

const API = "https://smartmart-w2gb.onrender.com/api";

function AdminSellers() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, productsResponse] =
        await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/products`),
        ]);

      setUsers(usersResponse.data || []);
      setProducts(productsResponse.data || []);

      console.log(
        "Sellers:",
        usersResponse.data
      );

      console.log(
        "Products:",
        productsResponse.data
      );
    } catch (error) {
      console.error(
        "Failed to load seller data:",
        error
      );

      setError(
        "Unable to load sellers. Make sure the Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // SELLERS
  // =====================================================

  const sellers = useMemo(() => {
    return users.filter(
      (user) =>
        String(user.role || "").toUpperCase() ===
        "SELLER"
    );
  }, [users]);

  // =====================================================
  // SELLER INFORMATION
  // =====================================================

  const getSellerProducts = (sellerId) => {
    return products.filter(
      (product) =>
        Number(product.sellerId) === Number(sellerId)
    );
  };

  const getSellerStock = (sellerId) => {
    return getSellerProducts(sellerId).reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );
  };

  const getSellerValue = (sellerId) => {
    return getSellerProducts(sellerId).reduce(
      (total, product) =>
        total +
        Number(product.price || 0) *
          Number(product.stock || 0),
      0
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredSellers = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    if (!searchText) {
      return sellers;
    }

    return sellers.filter((seller) => {
      return (
        seller.name
          ?.toLowerCase()
          .includes(searchText) ||
        seller.email
          ?.toLowerCase()
          .includes(searchText) ||
        String(seller.id).includes(searchText)
      );
    });
  }, [sellers, search]);

  // =====================================================
  // STATS
  // =====================================================

  const totalSellers = sellers.length;

  const activeSellers = sellers.length;

  const sellersWithProducts = sellers.filter(
    (seller) =>
      getSellerProducts(seller.id).length > 0
  ).length;

  const totalSellerProducts = products.filter(
    (product) => product.sellerId
  ).length;

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) {
      return "S";
    }

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
            Sellers Management
          </h2>

          <p className="text-gray-500 mt-1">
            View all registered sellers and their marketplace products
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh Sellers
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Sellers
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {totalSellers}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Store size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Sellers
              </p>

              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {activeSellers}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Sellers With Products
              </p>

              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {sellersWithProducts}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Package size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Seller Products
              </p>

              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {totalSellerProducts}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Package size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <div className="relative">
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
            placeholder="Search sellers by name, email or ID..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* =====================================================
          SELLERS TABLE
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">
            All Sellers
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Seller information and product statistics
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={30}
            />

            <p className="text-gray-500 mt-3">
              Loading sellers...
            </p>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="p-12 text-center">
            <Store
              className="mx-auto text-gray-300"
              size={50}
            />

            <h3 className="font-semibold text-gray-900 mt-4">
              No sellers found
            </h3>

            <p className="text-gray-500 mt-1">
              Try changing your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Seller
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Products
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Inventory Value
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Registered
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSellers.map((seller) => {
                  const sellerProducts =
                    getSellerProducts(seller.id);

                  const sellerStock =
                    getSellerStock(seller.id);

                  const sellerValue =
                    getSellerValue(seller.id);

                  return (
                    <tr
                      key={seller.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* SELLER */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
                            {getInitials(
                              seller.name
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {seller.name ||
                                "Unknown Seller"}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID #{seller.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4 text-gray-600">
                        {seller.email || "No email"}
                      </td>

                      {/* PRODUCTS */}

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          <Package size={13} />

                          {sellerProducts.length}
                        </span>
                      </td>

                      {/* STOCK */}

                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900">
                          {sellerStock}
                        </span>
                      </td>

                      {/* VALUE */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                          <IndianRupee size={14} />

                          {sellerValue.toFixed(2)}
                        </div>
                      </td>

                      {/* REGISTERED */}

                      <td className="px-5 py-4 text-gray-500">
                        {seller.createdAt
                          ? new Date(
                              seller.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSellers;
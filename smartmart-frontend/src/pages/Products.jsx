import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    ShoppingBag,
} from "lucide-react";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    // Keep a high default so products are not accidentally hidden
    const [maxPrice, setMaxPrice] = useState(1000000);

    const [sort, setSort] = useState("default");
    const [showFilters, setShowFilters] = useState(false);

    // =========================
    // FETCH PRODUCTS
    // =========================
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                " https://smartmart-w2gb.onrender.com/api/products"
            );

            console.log("Products received from backend:", response.data);

            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]);
                setError("Invalid product data received from server.");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Unable to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CATEGORIES
    // =========================
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

    // =========================
    // FILTER + SEARCH + SORT
    // =========================
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // SEARCH
        if (search.trim() !== "") {
            const searchText = search.toLowerCase();

            result = result.filter((product) => {
                const name = product.name?.toLowerCase() || "";
                const description =
                    product.description?.toLowerCase() || "";
                const productCategory =
                    product.category?.toLowerCase() || "";

                return (
                    name.includes(searchText) ||
                    description.includes(searchText) ||
                    productCategory.includes(searchText)
                );
            });
        }

        // CATEGORY
        if (category !== "All") {
            result = result.filter(
                (product) => product.category === category
            );
        }

        // PRICE
        result = result.filter(
            (product) =>
                Number(product.price || 0) <= Number(maxPrice)
        );

        // SORT
        if (sort === "low-high") {
            result.sort(
                (a, b) =>
                    Number(a.price || 0) - Number(b.price || 0)
            );
        }

        if (sort === "high-low") {
            result.sort(
                (a, b) =>
                    Number(b.price || 0) - Number(a.price || 0)
            );
        }

        if (sort === "name") {
            result.sort((a, b) =>
                (a.name || "").localeCompare(b.name || "")
            );
        }

        return result;
    }, [products, search, category, maxPrice, sort]);

    // =========================
    // CLEAR FILTERS
    // =========================
    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setMaxPrice(1000000);
        setSort("default");
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading products...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600">
                        Something went wrong
                    </h2>

                    <p className="text-gray-600 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={fetchProducts}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // =========================
    // PAGE
    // =========================
    return (
        <div className="min-h-screen bg-gray-50">

            {/* HERO */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-6 py-14">

                    <div className="flex items-center gap-3 mb-4">
                        <ShoppingBag size={32} />

                        <span className="text-blue-100 font-medium">
                            SmartMart Store
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold">
                        Explore Our Products
                    </h1>

                    <p className="text-blue-100 mt-3 max-w-2xl">
                        Find electronics, fashion, footwear, household
                        products and more — all in one place.
                    </p>

                </div>
            </section>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* SEARCH + SORT */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">

                    <div className="flex flex-col lg:flex-row gap-4">

                        {/* SEARCH */}
                        <div className="relative flex-1">

                            <Search
                                size={21}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search products..."
                                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    <X size={18} />
                                </button>
                            )}

                        </div>

                        {/* MOBILE FILTER */}
                        <button
                            onClick={() =>
                                setShowFilters(!showFilters)
                            }
                            className="lg:hidden flex items-center justify-center gap-2 bg-gray-100 px-5 py-3 rounded-xl font-medium"
                        >
                            <SlidersHorizontal size={20} />
                            Filters
                        </button>

                        {/* SORT */}
                        <div className="relative lg:w-56">

                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value)
                                }
                                className="appearance-none w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none cursor-pointer"
                            >
                                <option value="default">
                                    Sort: Featured
                                </option>

                                <option value="low-high">
                                    Price: Low to High
                                </option>

                                <option value="high-low">
                                    Price: High to Low
                                </option>

                                <option value="name">
                                    Name: A-Z
                                </option>
                            </select>

                            <ChevronDown
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                            />

                        </div>

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* FILTER SIDEBAR */}
                    <aside
                        className={`
                            ${showFilters ? "block" : "hidden"}
                            lg:block
                            w-full lg:w-64
                            bg-white
                            rounded-2xl
                            shadow-sm
                            p-6
                            h-fit
                        `}
                    >

                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-lg font-bold">
                                Filters
                            </h2>

                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Clear all
                            </button>

                        </div>

                        {/* CATEGORY */}
                        <div className="mb-8">

                            <h3 className="font-semibold mb-4">
                                Category
                            </h3>

                            <div className="space-y-3">

                                {categories.map((item) => (
                                    <label
                                        key={item}
                                        className="flex items-center gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={
                                                category === item
                                            }
                                            onChange={() =>
                                                setCategory(item)
                                            }
                                            className="w-4 h-4 accent-blue-600"
                                        />

                                        <span className="text-gray-600">
                                            {item}
                                        </span>
                                    </label>
                                ))}

                            </div>

                        </div>

                        {/* PRICE */}
                        <div>

                            <h3 className="font-semibold mb-4">
                                Maximum Price
                            </h3>

                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) =>
                                    setMaxPrice(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full accent-blue-600"
                            />

                            <div className="flex justify-between mt-3 text-sm text-gray-500">
                                <span>₹0</span>
                                <span>₹10,00,000</span>
                            </div>

                            <div className="mt-4 bg-blue-50 text-blue-700 font-semibold text-center py-2 rounded-lg">
                                Up to ₹
                                {Number(maxPrice).toLocaleString(
                                    "en-IN"
                                )}
                            </div>

                        </div>

                    </aside>

                    {/* PRODUCTS */}
                    <section className="flex-1">

                        {/* RESULTS HEADER */}
                        <div className="flex items-center justify-between mb-5">

                            <p className="text-gray-600">
                                Showing{" "}
                                <span className="font-semibold text-gray-900">
                                    {filteredProducts.length}
                                </span>{" "}
                                products
                            </p>

                        </div>

                        {/* NO PRODUCTS */}
                        {filteredProducts.length === 0 ? (

                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

                                <div className="text-5xl mb-4">
                                    🔍
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800">
                                    No products found
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Try changing your search or filters.
                                </p>

                                <button
                                    onClick={clearFilters}
                                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                                >
                                    Clear Filters
                                </button>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                                {filteredProducts.map((product) => (

                                    <div
                                        key={product.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
                                    >

                                        {/* IMAGE */}
                                        <div className="relative h-64 bg-gray-100 overflow-hidden">

                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name || "Product"}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ShoppingBag size={48} />
                                                </div>
                                            )}

                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                                {product.category || "General"}
                                            </span>

                                            {Number(product.stock) <= 5 && (
                                                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                                    Low Stock
                                                </span>
                                            )}

                                        </div>

                                        {/* CONTENT */}
                                        <div className="p-5">

                                            <h2 className="text-xl font-bold text-gray-900">
                                                {product.name || "Unnamed Product"}
                                            </h2>

                                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                {product.description ||
                                                    "No description available."}
                                            </p>

                                            <div className="flex items-center justify-between mt-5">

                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        ₹
                                                        {Number(
                                                            product.price || 0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {product.stock || 0}{" "}
                                                        items available
                                                    </p>
                                                </div>

                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
                                                >
                                                    View Product
                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>

            </main>
        </div>
    );
}

export default Products;

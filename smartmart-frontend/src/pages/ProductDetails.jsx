import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ShoppingCart,
    Package,
    Truck,
    Star,
    CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedImage, setSelectedImage] = useState(0);

    const { addToCart } = useCart();

    // Review states
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Rahul Sharma",
            rating: 5,
            comment:
                "Excellent product. The quality is really good and delivery was fast.",
            date: "2 days ago",
        },
        {
            id: 2,
            name: "Priya Singh",
            rating: 4,
            comment:
                "Very good product for the price. The build quality is impressive.",
            date: "5 days ago",
        },
        {
            id: 3,
            name: "Aman Verma",
            rating: 5,
            comment:
                "Really happy with my purchase. Would definitely recommend it.",
            date: "1 week ago",
        },
    ]);

    const [reviewName, setReviewName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);

    useEffect(() => {
        fetchProduct();
        fetchAllProducts();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `http://localhost:8080/api/products/${id}`
            );

            setProduct(response.data);
            setSelectedImage(0);
        } catch (err) {
            console.error(err);
            setError("Product not found.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/products"
            );

            setAllProducts(response.data);
        } catch (err) {
            console.error("Error loading suggested products:", err);
        }
    };

    // ------------------------------------------------
    // PRODUCT IMAGES
    // ------------------------------------------------

    const productImages = useMemo(() => {
        if (!product) return [];

        /*
         * For now we generate multiple visual views
         * using the same product image.
         *
         * Later these can come directly from MySQL.
         */

        return [
            product.image,
            product.image,
            product.image,
            product.image,
        ];
    }, [product]);

    // ------------------------------------------------
    // SUGGESTED PRODUCTS
    // ------------------------------------------------

    const suggestedProducts = useMemo(() => {
        if (!product) return [];

        return allProducts
            .filter(
                (item) =>
                    item.category === product.category &&
                    item.id !== product.id
            )
            .slice(0, 4);
    }, [allProducts, product]);

    // ------------------------------------------------
    // REVIEWS
    // ------------------------------------------------

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                  ) / reviews.length
              ).toFixed(1)
            : "0.0";

    const submitReview = (e) => {
        e.preventDefault();

        if (!reviewName.trim() || !reviewText.trim()) {
            alert("Please enter your name and review.");
            return;
        }

        const newReview = {
            id: Date.now(),
            name: reviewName,
            rating: reviewRating,
            comment: reviewText,
            date: "Just now",
        };

        setReviews([newReview, ...reviews]);

        setReviewName("");
        setReviewText("");
        setReviewRating(5);
    };

    // ------------------------------------------------
    // LOADING
    // ------------------------------------------------

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading product...
                    </p>

                </div>
            </div>
        );
    }

    // ------------------------------------------------
    // ERROR
    // ------------------------------------------------

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">

                    <div className="text-5xl mb-4">
                        😕
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Product Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        We couldn't find the product you're looking for.
                    </p>

                    <Link
                        to="/products"
                        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                    >
                        Back to Products
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* BACK */}
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </Link>

                {/* =========================================
                    PRODUCT SECTION
                ========================================== */}

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* =================================
                            IMAGE GALLERY
                        ================================== */}

                        <div className="p-6 lg:p-8">

                            {/* MAIN IMAGE */}

                            <div className="h-[450px] bg-gray-100 rounded-2xl overflow-hidden">

                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                />

                            </div>

                            {/* THUMBNAILS */}

                            <div className="grid grid-cols-4 gap-3 mt-4">

                                {productImages.map(
                                    (image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(
                                                    index
                                                )
                                            }
                                            className={`h-24 rounded-xl overflow-hidden border-2 transition ${
                                                selectedImage ===
                                                index
                                                    ? "border-blue-600"
                                                    : "border-transparent hover:border-gray-300"
                                            }`}
                                        >

                                            <img
                                                src={image}
                                                alt={`${product.name} view ${
                                                    index + 1
                                                }`}
                                                className="w-full h-full object-cover"
                                            />

                                        </button>
                                    )
                                )}

                            </div>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Product views
                            </p>

                        </div>

                        {/* =================================
                            PRODUCT INFORMATION
                        ================================== */}

                        <div className="p-8 lg:p-12">

                            {/* CATEGORY */}

                            <span className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                {product.category}
                            </span>

                            {/* NAME */}

                            <h1 className="text-4xl font-bold text-gray-900 mt-5">
                                {product.name}
                            </h1>

                            {/* RATING */}

                            <div className="flex items-center gap-2 mt-4">

                                <div className="flex text-yellow-400">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <Star
                                                key={star}
                                                size={19}
                                                fill="currentColor"
                                            />
                                        )
                                    )}

                                </div>

                                <span className="font-semibold">
                                    {averageRating}
                                </span>

                                <span className="text-gray-500">
                                    ({reviews.length} reviews)
                                </span>

                            </div>

                            {/* DESCRIPTION */}

                            <p className="text-gray-600 text-lg leading-relaxed mt-6">
                                {product.description}
                            </p>

                            {/* PRICE */}

                            <div className="mt-8">

                                <span className="text-4xl font-bold text-gray-900">
                                    ₹
                                    {Number(
                                        product.price
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>

                            {/* STOCK */}

                            <div className="mt-5">

                                {product.stock > 0 ? (
                                    <span className="text-green-600 font-medium">
                                        ✓ {product.stock} items
                                        available
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-medium">
                                        Out of stock
                                    </span>
                                )}

                            </div>

                            {/* CART BUTTON */}

                            <button
                              disabled={product.stock <= 0}
                              onClick={() => addToCart(product)}
                              className="mt-8 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                          >
                              <ShoppingCart size={22} />
                              Add to Cart
                          </button>

                            {/* DELIVERY FEATURES */}

                            <div className="border-t border-gray-200 mt-10 pt-8 space-y-5">

                                <div className="flex items-center gap-4">

                                    <div className="bg-blue-50 p-3 rounded-xl">
                                        <Truck
                                            size={22}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Fast Delivery
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Quick and reliable
                                            delivery
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div className="bg-blue-50 p-3 rounded-xl">
                                        <Package
                                            size={22}
                                            className="text-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Secure Packaging
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Carefully packed for
                                            safe delivery
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-4">

                                    <div className="bg-green-50 p-3 rounded-xl">
                                        <CheckCircle
                                            size={22}
                                            className="text-green-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Quality Assured
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Quality checked products
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================================
                    REVIEWS
                ========================================== */}

                <section className="mt-10 bg-white rounded-3xl shadow-sm p-6 sm:p-10">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <h2 className="text-3xl font-bold text-gray-900">
                                Customer Reviews
                            </h2>

                            <p className="text-gray-500 mt-2">
                                See what customers think about this
                                product.
                            </p>

                        </div>

                        <div className="flex items-center gap-4">

                            <div className="text-4xl font-bold">
                                {averageRating}
                            </div>

                            <div>

                                <div className="flex text-yellow-400">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <Star
                                                key={star}
                                                size={20}
                                                fill="currentColor"
                                            />
                                        )
                                    )}

                                </div>

                                <p className="text-sm text-gray-500">
                                    {reviews.length} reviews
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* REVIEW FORM */}

                    <div className="mt-10 bg-gray-50 rounded-2xl p-6">

                        <h3 className="text-xl font-bold mb-5">
                            Write a Review
                        </h3>

                        <form
                            onSubmit={submitReview}
                            className="space-y-5"
                        >

                            <input
                                type="text"
                                placeholder="Your name"
                                value={reviewName}
                                onChange={(e) =>
                                    setReviewName(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {/* RATING */}

                            <div>

                                <p className="text-sm font-medium mb-2">
                                    Your Rating
                                </p>

                                <div className="flex gap-1">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() =>
                                                    setReviewRating(
                                                        star
                                                    )
                                                }
                                                className={
                                                    star <=
                                                    reviewRating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            >
                                                <Star
                                                    size={26}
                                                    fill="currentColor"
                                                />
                                            </button>
                                        )
                                    )}

                                </div>

                            </div>

                            <textarea
                                rows="4"
                                placeholder="Share your experience..."
                                value={reviewText}
                                onChange={(e) =>
                                    setReviewText(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
                            >
                                Submit Review
                            </button>

                        </form>

                    </div>

                    {/* REVIEW LIST */}

                    <div className="mt-10 space-y-6">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="border-b border-gray-100 pb-6"
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h3 className="font-bold">
                                            {review.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-1">

                                            <div className="flex text-yellow-400">

                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                        <Star
                                                            key={
                                                                star
                                                            }
                                                            size={16}
                                                            fill={
                                                                star <=
                                                                review.rating
                                                                    ? "currentColor"
                                                                    : "none"
                                                        }
                                                        />
                                                    )
                                                )}

                                            </div>

                                            <span className="text-sm text-gray-400">
                                                {review.date}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <p className="text-gray-600 mt-3">
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>

                </section>

                {/* =========================================
                    SUGGESTED PRODUCTS
                ========================================== */}

                {suggestedProducts.length > 0 && (

                    <section className="mt-10">

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h2 className="text-3xl font-bold text-gray-900">
                                    You May Also Like
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    More products from{" "}
                                    <span className="font-semibold">
                                        {product.category}
                                    </span>
                                </p>

                            </div>

                            <Link
                                to="/products"
                                className="text-blue-600 font-medium hover:text-blue-800"
                            >
                                View All
                            </Link>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                            {suggestedProducts.map(
                                (item) => (

                                    <Link
                                        key={item.id}
                                        to={`/products/${item.id}`}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
                                    >

                                        <div className="h-56 bg-gray-100 overflow-hidden">

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />

                                        </div>

                                        <div className="p-5">

                                            <span className="text-xs font-semibold text-blue-600">
                                                {item.category}
                                            </span>

                                            <h3 className="font-bold text-lg mt-1">
                                                {item.name}
                                            </h3>

                                            <div className="flex items-center justify-between mt-4">

                                                <span className="text-xl font-bold">
                                                    ₹
                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                                <span className="text-blue-600 text-sm font-medium">
                                                    View →
                                                </span>

                                            </div>

                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    </section>

                )}

            </main>

        </div>
    );
}

export default ProductDetails;
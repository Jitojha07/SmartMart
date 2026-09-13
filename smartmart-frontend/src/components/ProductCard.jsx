import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
} from "lucide-react";

function ProductCard({ product }) {
  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) /
          product.oldPrice) *
          100
      )
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl
      border border-gray-200 overflow-hidden
      hover:shadow-xl hover:-translate-y-1
      transition-all duration-300"
    >

      {/* ================= IMAGE ================= */}

      <Link to={`/products/${product.id}`}>

        <div className="relative h-56 bg-gray-100 overflow-hidden">

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover
            group-hover:scale-105
            transition-transform duration-500"
          />

          {discount > 0 && (
            <span
              className="absolute top-3 left-3
              bg-red-500 text-white
              px-2.5 py-1 rounded-full
              text-xs font-bold"
            >
              {discount}% OFF
            </span>
          )}

        </div>

      </Link>

      {/* ================= INFORMATION ================= */}

      <div className="p-4">

        <p className="text-xs uppercase tracking-wide
          text-blue-600 font-semibold">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>

          <h3
            className="text-lg font-semibold
            text-gray-900 mt-1
            line-clamp-1
            hover:text-blue-600 transition"
          >
            {product.name}
          </h3>

        </Link>

        <p className="text-sm text-gray-500 mt-1">
          Sold by {product.seller}
        </p>

        {/* Rating */}

        <div className="flex items-center gap-1 mt-3">

          <Star
            size={15}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm font-semibold">
            {product.rating}
          </span>

          <span className="text-xs text-gray-500">
            ({product.reviews})
          </span>

        </div>

        {/* Price */}

        <div className="flex items-center gap-2 mt-3">

          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </span>
          )}

        </div>

        {/* Cart */}

        <button
          type="button"
          className="w-full mt-4 py-2.5
          rounded-lg bg-blue-600 text-white
          font-semibold
          flex items-center justify-center gap-2
          hover:bg-blue-700
          active:scale-[0.98]
          transition"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;
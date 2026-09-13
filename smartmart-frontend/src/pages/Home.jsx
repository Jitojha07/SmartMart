import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Store,
} from "lucide-react";

import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Home() {
  const featuredProducts = products.slice(0, 4);

  const categories = [
    {
      name: "Electronics",
      icon: "💻",
      description: "Latest gadgets & devices",
    },
    {
      name: "Fashion",
      icon: "👕",
      description: "Style for every occasion",
    },
    {
      name: "Accessories",
      icon: "⌚",
      description: "Complete your look",
    },
    {
      name: "Home & Living",
      icon: "🏠",
      description: "Make your home better",
    },
  ];

  return (
    <div>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-[520px] flex items-center">

            <div className="max-w-2xl text-white">

              <span className="inline-block px-4 py-2 rounded-full
                bg-white/15 text-sm font-medium mb-6">
                Your Marketplace, Your Choice
              </span>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Shop Smart.
                <br />
                Shop Everything.
              </h1>

              <p className="mt-6 text-lg md:text-xl text-blue-100
                max-w-xl leading-relaxed">
                Discover products from multiple trusted sellers
                in one convenient online marketplace.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <Link
                  to="/products"
                  className="px-6 py-3 bg-white text-blue-700
                  rounded-lg font-semibold
                  hover:bg-gray-100 transition
                  flex items-center gap-2"
                >
                  Shop Now
                  <ArrowRight size={19} />
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3 border border-white
                  text-white rounded-lg font-semibold
                  hover:bg-white/10 transition"
                >
                  Become a Seller
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= CATEGORIES ================= */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-8">

            <div>
              <p className="text-blue-600 font-semibold">
                EXPLORE
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2
              text-blue-600 font-medium hover:text-blue-700"
            >
              View All
              <ArrowRight size={18} />
            </Link>

          </div>


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            {categories.map((category) => (
              <Link
                to={`/products?category=${category.name}`}
                key={category.name}
                className="bg-white border border-gray-200
                rounded-xl p-6 text-center
                hover:shadow-lg hover:-translate-y-1
                transition duration-300"
              >

                <div className="text-5xl mb-4">
                  {category.icon}
                </div>

                <h3 className="font-semibold text-lg text-gray-900">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {category.description}
                </p>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-16 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-8">

            <div>
              <p className="text-blue-600 font-semibold">
                TOP PICKS
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Featured Products
              </h2>

              <p className="text-gray-500 mt-2">
                Popular products selected for you
              </p>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2
              text-blue-600 font-medium"
            >
              View All
              <ArrowRight size={18} />
            </Link>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2
            lg:grid-cols-4 gap-6">

            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </div>

      </section>


      {/* ================= WHY SMARTMART ================= */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <p className="text-blue-600 font-semibold">
              WHY SMARTMART
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              Shopping Made Simple
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-blue-100
                text-blue-600 rounded-full
                flex items-center justify-center">
                <ShieldCheck size={28} />
              </div>

              <h3 className="font-semibold text-lg mt-4">
                Secure Shopping
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                Your account and shopping experience are protected.
              </p>
            </div>


            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-green-100
                text-green-600 rounded-full
                flex items-center justify-center">
                <Truck size={28} />
              </div>

              <h3 className="font-semibold text-lg mt-4">
                Fast Delivery
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                Get your products delivered conveniently.
              </p>
            </div>


            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-orange-100
                text-orange-600 rounded-full
                flex items-center justify-center">
                <Headphones size={28} />
              </div>

              <h3 className="font-semibold text-lg mt-4">
                Customer Support
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                We're here to help whenever you need us.
              </p>
            </div>


            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-purple-100
                text-purple-600 rounded-full
                flex items-center justify-center">
                <Store size={28} />
              </div>

              <h3 className="font-semibold text-lg mt-4">
                Multiple Sellers
              </h3>

              <p className="text-gray-500 mt-2 text-sm">
                Discover products from different sellers.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= SELLER CTA ================= */}
      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-gray-900 rounded-2xl p-8 md:p-12
            flex flex-col md:flex-row
            items-center justify-between gap-8">

            <div>

              <p className="text-blue-400 font-semibold">
                SELL ON SMARTMART
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                Grow Your Business With Us
              </h2>

              <p className="text-gray-400 mt-3 max-w-xl">
                Join our marketplace and reach more customers
                with your products.
              </p>

            </div>

            <Link
              to="/register"
              className="shrink-0 px-7 py-3 bg-blue-600
              text-white rounded-lg font-semibold
              hover:bg-blue-700 transition"
            >
              Start Selling
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
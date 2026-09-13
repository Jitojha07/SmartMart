import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Smart<span className="text-blue-500">Mart</span>
            </h2>

            <p className="text-gray-400 leading-relaxed">
              A multi-vendor online marketplace connecting customers
              with sellers through a simple and secure platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/products" className="hover:text-blue-400 transition">
                  Products
                </Link>
              </li>

              <li>
                <Link to="/cart" className="hover:text-blue-400 transition">
                  Cart
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-blue-400 transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Customer Service
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Help Center
                </Link>
              </li>

              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Shipping Information
                </Link>
              </li>

              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Return Policy
                </Link>
              </li>

              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Connect With Us
            </h3>

            <p className="text-gray-400 mb-4">
              Follow SmartMart for updates and announcements.
            </p>

            <div className="flex gap-3">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800
                flex items-center justify-center
                hover:bg-blue-600 hover:text-white transition"
              >
                GH
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800
                flex items-center justify-center
                hover:bg-blue-600 hover:text-white transition"
              >
                IG
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800
                flex items-center justify-center
                hover:bg-blue-600 hover:text-white transition"
              >
                IN
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div
          className="border-t border-gray-800 mt-10 pt-6
          flex flex-col md:flex-row items-center
          justify-between gap-3"
        >
          <p className="text-sm text-gray-500">
            © 2026 SmartMart. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            B.Tech Mini Project
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
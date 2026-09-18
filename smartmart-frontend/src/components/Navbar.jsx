import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount, totalItems } = useCart();

  // ==========================================
  // LOAD USER FROM LOCAL STORAGE
  // ==========================================
  
  const loadUser = () => {
      try {
          // First check localStorage
          let savedUser =
              localStorage.getItem("smartmartUser");

          // If not found, check sessionStorage
          if (!savedUser) {
              savedUser =
                  sessionStorage.getItem("smartmartUser");
          }

          console.log(
              "Navbar saved user:",
              savedUser
          );

          if (savedUser) {
              const parsedUser =
                  JSON.parse(savedUser);

              console.log(
                  "Navbar parsed user:",
                  parsedUser
              );

              setUser(parsedUser);
          } else {
              setUser(null);
          }

      } catch (error) {
          console.error(
              "Error loading user:",
              error
          );

          localStorage.removeItem("smartmartUser");
          sessionStorage.removeItem("smartmartUser");

          setUser(null);
      }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    loadUser();
  }, []);

  // ==========================================
  // CHECK USER WHEN ROUTE CHANGES
  // ==========================================
  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  // ==========================================
  // LISTEN FOR LOGIN
  // ==========================================
  useEffect(() => {
    window.addEventListener("userLogin", loadUser);

    return () => {
      window.removeEventListener("userLogin", loadUser);
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("smartmartUser");
    sessionStorage.removeItem("smartmartUser");

    setUser(null);

    window.dispatchEvent(
      new Event("userLogout")
    );

    setMobileMenuOpen(false);

    navigate("/");
  };

  // ==========================================
  // PROFILE
  // ==========================================
  const handleProfileClick = () => {
    setMobileMenuOpen(false);

    navigate("/dashboard");
  };

  // ==========================================
  // NAV LINK STYLE
  // ==========================================
  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header
      className="sticky top-0 z-50 bg-white
      border-b border-gray-200 shadow-sm"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================
            MAIN NAVBAR
        ====================================== */}
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >

            <div
              className="w-9 h-9 bg-blue-600 rounded-lg
              flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">
                S
              </span>
            </div>

            <span className="text-2xl font-bold text-gray-900">
              Smart<span className="text-blue-600">
                Mart
              </span>
            </span>

          </Link>

          {/* ======================================
              DESKTOP SEARCH
          ====================================== */}
          <div
            className="hidden md:flex
            flex-1 max-w-xl mx-8"
          >

            <div className="relative w-full">

              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-10 pl-4 pr-12
                rounded-lg border border-gray-300
                focus:outline-none focus:ring-2
                focus:ring-blue-500
                focus:border-transparent"
              />

              <button
                type="button"
                className="absolute right-0 top-0
                h-10 w-11
                flex items-center justify-center
                bg-blue-600 text-white
                rounded-r-lg
                hover:bg-blue-700 transition"
              >
                <Search size={19} />
              </button>

            </div>

          </div>

          {/* ======================================
              DESKTOP NAVIGATION
          ====================================== */}
          <nav
            className="hidden md:flex
            items-center gap-6"
          >

            {/* Home */}
            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>

            {/* Products */}
            <NavLink
              to="/products"
              className={navLinkClass}
            >
              Products
            </NavLink>

            {/* Orders */}
            <Link
              to="/orders"
              className="text-gray-700
              hover:text-blue-600 transition"
            >
              My Orders
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2
              text-gray-700
              hover:text-blue-600 transition"
            >

              <ShoppingCart size={24} />

              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1
                  min-w-[20px] h-5 px-1
                  bg-red-500 text-white
                  text-xs font-bold rounded-full
                  flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}

            </Link>

            {/* ======================================
                NOT LOGGED IN
            ====================================== */}
            {!user && (
              <Link
                to="/login"
                className="flex items-center gap-2
                text-gray-700
                hover:text-blue-600 transition"
              >

                <User size={21} />

                <span>
                  Login
                </span>

              </Link>
            )}

            {/* ======================================
                LOGGED IN
            ====================================== */}
            {user && (
              <div className="relative group">

                {/* Profile Button */}
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="flex items-center gap-2
                  text-gray-700
                  hover:text-blue-600 transition"
                >

                  <div
                    className="w-9 h-9 rounded-full
                    bg-blue-100
                    flex items-center justify-center"
                  >

                    <User
                      size={21}
                      className="text-blue-600"
                    />

                  </div>

                  <span
                    className="font-medium
                    max-w-[100px] truncate"
                  >
                    {user.name || "Profile"}
                  </span>

                </button>

                {/* Dropdown */}
                <div
                  className="absolute right-0 top-12
                  w-52 bg-white
                  border border-gray-200
                  rounded-xl shadow-lg
                  p-2
                  opacity-0 invisible
                  group-hover:opacity-100
                  group-hover:visible
                  transition-all duration-200
                  z-50"
                >

                  {/* User Info */}
                  <div
                    className="px-3 py-3
                    border-b border-gray-100 mb-1"
                  >

                    <p
                      className="font-semibold
                      text-gray-900 truncate"
                    >
                      {user.name}
                    </p>

                    <p
                      className="text-sm
                      text-gray-500 truncate"
                    >
                      {user.email}
                    </p>

                  </div>

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="w-full text-left
                    px-3 py-2.5 rounded-lg
                    hover:bg-gray-100
                    text-gray-700 transition"
                  >
                    My Profile
                  </button>

                  {/* Orders */}
                  <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="w-full text-left
                    px-3 py-2.5 rounded-lg
                    hover:bg-gray-100
                    text-gray-700 transition"
                  >
                    My Orders
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left
                    px-3 py-2.5 rounded-lg
                    hover:bg-red-50
                    text-red-600 transition
                    flex items-center gap-2"
                  >

                    <LogOut size={18} />

                    Logout

                  </button>

                </div>

              </div>
            )}

          </nav>

          {/* ======================================
              MOBILE BUTTON
          ====================================== */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="md:hidden
            text-gray-700
            hover:text-blue-600 transition"
            aria-label="Toggle menu"
          >

            {mobileMenuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}

          </button>

        </div>

        {/* ======================================
            MOBILE MENU
        ====================================== */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4
            border-t border-gray-200"
          >

            {/* Mobile Search */}
            <div className="relative mb-4">

              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-10 pl-4 pr-12
                rounded-lg border border-gray-300
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500"
              />

              <button
                type="button"
                className="absolute right-0 top-0
                h-10 w-11
                flex items-center justify-center
                bg-blue-600 text-white
                rounded-r-lg
                hover:bg-blue-700 transition"
              >
                <Search size={18} />
              </button>

            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4">

              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={navLinkClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                Products
              </NavLink>

              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                My Orders
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex items-center justify-between
                  ${navLinkClass({ isActive })}`
                }
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >

                <span>
                  Cart
                </span>

                {cartCount > 0 && (
                  <span
                    className="min-w-6 h-6 px-1.5
                    flex items-center justify-center
                    bg-blue-600 text-white
                    text-xs font-bold rounded-full"
                  >
                    {cartCount}
                  </span>
                )}

              </NavLink>

              {/* Mobile Login */}
              {!user && (
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                >
                  Login
                </NavLink>
              )}

              {/* Mobile Profile */}
              {user && (
                <>
                  <button
                    type="button"
                    onClick={handleProfileClick}
                    className="flex items-center gap-3
                    text-left text-gray-700
                    hover:text-blue-600 transition"
                  >

                    <div
                      className="w-9 h-9 rounded-full
                      bg-blue-100
                      flex items-center justify-center"
                    >

                      <User
                        size={20}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <p className="font-medium">
                        {user.name || "Profile"}
                      </p>

                      <p className="text-xs text-gray-500">
                        My Profile
                      </p>

                    </div>

                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2
                    text-red-600
                    hover:text-red-700
                    transition text-left"
                  >

                    <LogOut size={19} />

                    Logout

                  </button>
                </>
              )}

            </nav>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;
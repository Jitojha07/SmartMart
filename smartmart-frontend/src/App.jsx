import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";

function getLoggedInUser() {
  const localUser = localStorage.getItem("smartmartUser");
  const sessionUser = sessionStorage.getItem("smartmartUser");

  const savedUser = localUser || sessionUser;

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("smartmartUser");
    sessionStorage.removeItem("smartmartUser");

    return null;
  }
}

function RoleRoute({ allowedRoles, children }) {
  const user = getLoggedInUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = String(user.role || "").toUpperCase();

  if (!allowedRoles.includes(userRole)) {
    if (userRole === "SELLER") {
      return <Navigate to="/seller" replace />;
    }

    if (userRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (userRole === "CUSTOMER") {
      return <Navigate to="/" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

/*
  Special Admin Route

  - Not logged in → show Admin Login
  - ADMIN → show Admin Dashboard
  - CUSTOMER / SELLER → reject and go home
*/
function AdminRoute() {
  const user = getLoggedInUser();

  if (!user) {
    return <AdminLogin />;
  }

  const userRole = String(
    user.role || ""
  ).toUpperCase();

  if (userRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
}

function AppContent() {
  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  const isSellerPage =
    location.pathname.startsWith("/seller");

  const hideNavbar =
    isAdminPage ||
    isSellerPage;

  const hideFooter =
    isAdminPage ||
    isSellerPage;

  return (
    <>
      <ScrollToTop />

      {!hideNavbar && <Navbar />}

      <main className="page-enter">
        <Routes>

          {/* Public */}
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Customer */}
          <Route
            path="/cart"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <Cart />
              </RoleRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <Checkout />
              </RoleRoute>
            }
          />

          <Route
            path="/order-success/:id"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <OrderSuccess />
              </RoleRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <MyOrders />
              </RoleRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={["CUSTOMER"]}>
                <CustomerDashboard />
              </RoleRoute>
            }
          />

          {/* Seller */}
          <Route
            path="/seller"
            element={
              <RoleRoute allowedRoles={["SELLER"]}>
                <SellerDashboard />
              </RoleRoute>
            }
          />

          {/* Private Admin */}
          <Route
            path="/admin"
            element={<AdminRoute />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
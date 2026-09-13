import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
  Store,
} from "lucide-react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("CUSTOMER");
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Login response:", response.data);

      const loggedInUser = response.data;

      // ==========================================
      // CHECK USER ROLE
      // ==========================================

      if (!loggedInUser || !loggedInUser.role) {
        alert("User role was not received from the server.");
        return;
      }

      const backendRole = loggedInUser.role.toUpperCase();
      const selectedRole = loginType.toUpperCase();

      console.log("Backend role:", backendRole);
      console.log("Selected login type:", selectedRole);

      // Admin can login directly
      if (backendRole !== "ADMIN" && backendRole !== selectedRole) {
        alert(
          `This account is registered as ${backendRole}. Please select ${backendRole} to login.`
        );
        return;
      }

      // ==========================================
      // CLEAR OLD LOGIN FROM BOTH STORAGE TYPES
      // ==========================================

      localStorage.removeItem("smartmartUser");
      sessionStorage.removeItem("smartmartUser");

      // ==========================================
      // SAVE USER
      // ==========================================

      if (rememberMe) {
        localStorage.setItem(
          "smartmartUser",
          JSON.stringify(loggedInUser)
        );
      } else {
        sessionStorage.setItem(
          "smartmartUser",
          JSON.stringify(loggedInUser)
        );
      }

      // ==========================================
      // NOTIFY NAVBAR
      // ==========================================

      window.dispatchEvent(new Event("userLogin"));

      alert("Login successful!");

      // ==========================================
      // REDIRECT
      // ==========================================

      if (backendRole === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (backendRole === "SELLER") {
        navigate("/seller", { replace: true });
      } else if (backendRole === "CUSTOMER") {
        navigate("/", { replace: true });
      } else {
        alert("Unknown user role: " + backendRole);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else {
        alert(
          "Cannot connect to the server. Make sure Spring Boot is running."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="
              inline-flex w-16 h-16 items-center justify-center
              bg-blue-600 rounded-2xl shadow-lg
            "
          >
            <ShoppingBag
              size={30}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-5">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your SmartMart account
          </p>
        </div>

        {/* Card */}
        <div
          className="
            bg-white rounded-2xl border border-gray-200
            shadow-sm p-6 sm:p-8
          "
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Login As
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Customer */}
                <button
                  type="button"
                  onClick={() => setLoginType("CUSTOMER")}
                  className={`
                    flex items-center justify-center gap-2
                    py-3 rounded-xl border font-semibold transition
                    ${
                      loginType === "CUSTOMER"
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <User size={19} />
                  Customer
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => setLoginType("SELLER")}
                  className={`
                    flex items-center justify-center gap-2
                    py-3 rounded-xl border font-semibold transition
                    ${
                      loginType === "SELLER"
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <Store size={19} />
                  Seller
                </button>

              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2 text-gray-400
                  "
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="
                    w-full pl-11 pr-4 py-3
                    border border-gray-300 rounded-xl
                    focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-transparent
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2 text-gray-400
                  "
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="
                    w-full pl-11 pr-12 py-3
                    border border-gray-300 rounded-xl
                    focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-transparent
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2 text-gray-400
                    hover:text-gray-600
                  "
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 accent-blue-600"
                />

                Remember me
              </label>

              <button
                type="button"
                className="
                  text-blue-600 font-medium
                  hover:text-blue-700
                "
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full py-3.5 bg-blue-600
                text-white rounded-xl font-semibold
                hover:bg-blue-700 active:scale-[0.99]
                transition
              "
            >
              Login as{" "}
              {loginType === "SELLER"
                ? "Seller"
                : "Customer"}
            </button>
          </form>

          {/* Register */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400">
                New to SmartMart?
              </span>
            </div>
          </div>

          <Link
            to="/register"
            className="
              block w-full text-center py-3
              border border-gray-300 rounded-xl
              font-semibold text-gray-700
              hover:bg-gray-50 transition
            "
          >
            Create an Account
          </Link>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="
              text-sm text-gray-500
              hover:text-blue-600
            "
          >
            ← Back to SmartMart
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;

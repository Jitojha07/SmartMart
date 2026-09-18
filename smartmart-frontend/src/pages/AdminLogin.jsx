import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "https://smartmart-w2gb.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const loggedInUser = response.data;

      if (!loggedInUser || !loggedInUser.role) {
        alert("Invalid admin credentials.");
        return;
      }

      const backendRole = String(
        loggedInUser.role
      ).toUpperCase();

      // Only ADMIN is allowed here
      if (backendRole !== "ADMIN") {
        alert(
          "Access denied. This page is only for administrators."
        );
        return;
      }

      // Clear previous login
      localStorage.removeItem("smartmartUser");
      sessionStorage.removeItem("smartmartUser");

      // Save admin session
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

      window.dispatchEvent(new Event("userLogin"));

      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Invalid admin email or password."
        );
      } else {
        alert(
          "Cannot connect to the server. Make sure Spring Boot is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <div
            className="
              inline-flex w-16 h-16
              items-center justify-center
              bg-blue-600
              rounded-2xl
              shadow-lg shadow-blue-600/20
            "
          >
            <ShieldCheck
              size={32}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Admin Login
          </h1>

          <p className="text-gray-400 mt-2">
            SmartMart Administration
          </p>

        </div>

        {/* Login Card */}
        <div
          className="
            bg-white
            rounded-2xl
            shadow-2xl
            p-6 sm:p-8
          "
        >

          {/* Private Access Notice */}
          <div
            className="
              mb-6
              p-4
              rounded-xl
              bg-blue-50
              border border-blue-100
            "
          >
            <div className="flex items-start gap-3">

              <ShieldCheck
                size={20}
                className="text-blue-600 mt-0.5"
              />

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Private Administrator Access
                </p>

                <p className="text-xs text-blue-700 mt-1">
                  This login is restricted to authorized
                  SmartMart administrators.
                </p>
              </div>

            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                  className="
                    w-full
                    pl-11 pr-4
                    py-3
                    border border-gray-300
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-transparent
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
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="
                    w-full
                    pl-11 pr-12
                    py-3
                    border border-gray-300
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-transparent
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-400
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

            {/* Remember */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 accent-blue-600"
                />

                Remember this device

              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3.5
                bg-blue-600
                text-white
                rounded-xl
                font-semibold
                hover:bg-blue-700
                disabled:bg-blue-400
                disabled:cursor-not-allowed
                transition
              "
            >
              {loading
                ? "Signing in..."
                : "Sign in as Administrator"}
            </button>

          </form>

        </div>

        {/* Footer */}
        <div className="text-center mt-6">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              text-sm
              text-gray-400
              hover:text-white
              transition
            "
          >
            ← Back to SmartMart
          </button>

        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  ShoppingBag,
  Store,
} from "lucide-react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      console.log("Registration response:", response.data);

      alert(
        `${formData.role === "SELLER" ? "Seller" : "Customer"} account created successfully!`
      );

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Registration failed. Please try again."
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
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-16 h-16 items-center justify-center
            bg-blue-600 rounded-2xl shadow-lg"
          >
            <ShoppingBag size={30} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-5">
            Create Your Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join the SmartMart marketplace
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl border border-gray-200
          shadow-sm p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Customer */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("CUSTOMER")}
                  className={`flex items-center justify-center gap-2
                    py-3 rounded-xl border font-semibold transition
                    ${
                      formData.role === "CUSTOMER"
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <User size={19} />
                  Customer
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("SELLER")}
                  className={`flex items-center justify-center gap-2
                    py-3 rounded-xl border font-semibold transition
                    ${
                      formData.role === "SELLER"
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Store size={19} />
                  Seller
                </button>

              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2
                  -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3
                  border border-gray-300 rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:border-transparent"
                />
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
                  className="absolute left-4 top-1/2
                  -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3
                  border border-gray-300 rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:border-transparent"
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
                  className="absolute left-4 top-1/2
                  -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3
                  border border-gray-300 rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2
                  -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3
                  border border-gray-300 rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Selected Account Message */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-sm text-blue-700">
                Creating a{" "}
                <span className="font-semibold">
                  {formData.role === "SELLER"
                    ? "Seller"
                    : "Customer"}
                </span>{" "}
                account.
              </p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-gray-500">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 accent-blue-600"
              />

              <span>
                I agree to the SmartMart terms and conditions.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600
              text-white rounded-xl font-semibold
              hover:bg-blue-700 active:scale-[0.99]
              transition"
            >
              Create {formData.role === "SELLER" ? "Seller" : "Customer"} Account
            </button>
          </form>

          {/* Login */}
          <div className="text-center mt-7">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}

              <Link
                to="/login"
                className="text-blue-600 font-semibold
                hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-500
            hover:text-blue-600"
          >
            ← Back to SmartMart
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;


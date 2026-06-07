import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaSignInAlt,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(formData.email, formData.password);

      alert("Login successful");

      navigate("/dashboard");
    } catch (error) {
      alert(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-8">
          <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl">
            <FaSignInAlt />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-5">
            RapidRescue
          </h1>

          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Login to continue your emergency assistance experience
          </p>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
              <div className="px-4 text-gray-500">
                <FaEnvelope />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
              <div className="px-4 text-gray-500">
                <FaLock />
              </div>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              active:scale-[0.98]
              text-white
              py-3
              rounded-xl
              font-bold
              transition
              duration-300
            "
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* ================= FOOTER ================= */}
        <p className="text-center text-gray-600 mt-6 text-sm md:text-base">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-red-600 font-bold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
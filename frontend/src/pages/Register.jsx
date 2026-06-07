import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
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

    try {
      setLoading(true);
      await register(formData);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl">
            <FaUserPlus />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-5">
            RapidRescue
          </h1>

          <p className="text-gray-500 mt-3">
            Create your emergency assistance account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            ["fullName", "Full Name", "text", <FaUser />],
            ["email", "Email Address", "email", <FaEnvelope />],
            ["phone", "Phone Number", "text", <FaPhone />],
            ["password", "Password", "password", <FaLock />],
            ["address", "Address", "text", <FaMapMarkerAlt />],
          ].map(([name, placeholder, type, icon]) => (
            <div
              key={name}
              className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500"
            >
              <div className="px-4 text-gray-500">{icon}</div>

              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required={name !== "address"}
                className="w-full px-4 py-3 outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white py-3 rounded-xl font-bold transition duration-300"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
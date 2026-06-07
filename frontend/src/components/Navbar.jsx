import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMapMarkedAlt,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaRoute
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = (
    <>
      <Link to="/dashboard" className="nav-link">
        <FaHome /> Dashboard
      </Link>

      <Link to="/map" className="nav-link">
        <FaMapMarkedAlt /> Map
      </Link>

      <Link to="/history" className="nav-link">
        <FaHistory /> History
      </Link>

      <Link to="/sos" className="nav-link">
        <FaBell /> SOS
      </Link>

      <Link to="/profile" className="nav-link">
        <FaUser /> {user?.fullName?.split(" ")[0] || "Profile"}
      </Link>

      <Link to="/multi-stop" className="nav-link">
  <FaRoute /> Multi-Stop
</Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-slate-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
            <FaShieldAlt />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            RapidRescue
          </h1>
        </Link>

        <button
          className="md:hidden text-2xl text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="hidden md:flex items-center gap-7 font-semibold">
          {navLinks}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-4 border-t border-slate-200">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
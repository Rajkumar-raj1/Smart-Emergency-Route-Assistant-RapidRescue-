import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaHospital,
  FaGasPump,
  FaFireExtinguisher,
  FaTools,
  FaRoute,
  FaBell,
  FaMapMarkerAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Home = () => {
  const features = [
    ["Medical Emergency", "Find nearby hospitals instantly.", <FaHospital />, "bg-red-100 text-red-600"],
    ["Police Assistance", "Locate nearby police stations.", <FaShieldAlt />, "bg-blue-100 text-blue-600"],
    ["Fuel Assistance", "Find nearby petrol pumps.", <FaGasPump />, "bg-green-100 text-green-600"],
    ["Fire Emergency", "Find nearby fire stations.", <FaFireExtinguisher />, "bg-orange-100 text-orange-600"],
    ["Vehicle Breakdown", "Find mechanics and roadside help.", <FaTools />, "bg-purple-100 text-purple-600"],
    ["Smart Routing", "Shortest route and ETA support.", <FaRoute />, "bg-cyan-100 text-cyan-600"],
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
     <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-5 py-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="bg-blue-600 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0">
          <FaShieldAlt />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold truncate">
          RapidRescue
        </h1>
      </div>

      <div className="hidden md:flex gap-8 font-semibold text-slate-700">
        <a href="#home" className="text-blue-600">
          Home
        </a>
        <a href="#features">Features</a>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          to="/login"
          className="px-3 sm:px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm sm:text-base font-semibold"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold whitespace-nowrap"
        >
          <span className="hidden sm:inline">Create Account</span>
          <span className="sm:hidden">Sign Up</span>
        </Link>
      </div>
    </div>
  </div>
</nav>

      <section id="home" className="bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-5 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-5">
              <FaShieldAlt /> Your Safety, Our Priority
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
              Smart Emergency Route Assistance Platform
            </h2>

            <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Find nearby hospitals, police stations, mechanics, petrol pumps,
              and emergency services with shortest route calculation, ETA, and SOS assistance.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                <FaSignInAlt /> Login
              </Link>

              <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md border">
                <FaUserPlus /> Create Account
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-blue-600 text-xl" />
                <div>
                  <h4 className="font-bold text-sm">Real-time Help</h4>
                  <p className="text-sm text-slate-500">Instant support</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-600 text-xl" />
                <div>
                  <h4 className="font-bold text-sm">Smart Routing</h4>
                  <p className="text-sm text-slate-500">Shortest path</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaBell className="text-purple-600 text-xl" />
                <div>
                  <h4 className="font-bold text-sm">SOS Alerts</h4>
                  <p className="text-sm text-slate-500">Quick alert</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative w-[360px] h-[420px] bg-white rounded-3xl shadow-2xl border p-6">
              <div className="absolute top-8 left-6 bg-white shadow-lg border rounded-2xl p-4 w-48">
                <FaHospital className="text-red-600 text-2xl" />
                <h4 className="font-bold mt-2">Hospitals</h4>
                <p className="text-sm text-slate-500">Nearby care</p>
              </div>

              <div className="absolute top-24 right-6 bg-white shadow-lg border rounded-2xl p-4 w-48">
                <FaShieldAlt className="text-blue-600 text-2xl" />
                <h4 className="font-bold mt-2">Police</h4>
                <p className="text-sm text-slate-500">Law support</p>
              </div>

              <div className="absolute bottom-24 left-8 bg-white shadow-lg border rounded-2xl p-4 w-48">
                <FaTools className="text-orange-600 text-2xl" />
                <h4 className="font-bold mt-2">Mechanics</h4>
                <p className="text-sm text-slate-500">Vehicle help</p>
              </div>

              <div className="absolute bottom-6 right-6 bg-red-600 text-white rounded-2xl p-4 shadow-xl">
                <h4 className="font-bold">SOS Alert</h4>
                <p className="text-sm text-red-100">Share location</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <p className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
            WHAT WE PROVIDE
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4">
            Emergency Assistance Features
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            RapidRescue provides location-based emergency support with route optimization and SOS help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(([title, desc, icon, color]) => (
            <div key={title} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-lg transition">
              <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4`}>
                {icon}
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-slate-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
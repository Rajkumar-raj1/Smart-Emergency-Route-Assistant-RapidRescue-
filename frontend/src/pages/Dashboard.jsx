import { useNavigate } from "react-router-dom";
import {
  FaHospital,
  FaShieldAlt,
  FaGasPump,
  FaFireExtinguisher,
  FaTools,
  FaSearchLocation,
  FaRoute
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import EmergencyCard from "../components/EmergencyCard";

const Dashboard = () => {
  const navigate = useNavigate();

  const emergencyOptions = [
    {
      title: "Medical Emergency",
      description: "Find nearby hospitals and medical help",
      type: "medical",
      icon: <FaHospital />,
      color: "bg-red-600",
    },
    {
      title: "Police Help",
      description: "Locate nearby police stations quickly",
      type: "police",
      icon: <FaShieldAlt />,
      color: "bg-blue-600",
    },
    {
      title: "Car Breakdown",
      description: "Find mechanics and vehicle repair help",
      type: "car_breakdown",
      icon: <FaTools />,
      color: "bg-yellow-600",
    },
    {
      title: "Fuel Needed",
      description: "Find nearest petrol pumps",
      type: "fuel",
      icon: <FaGasPump />,
      color: "bg-green-600",
    },
    {
      title: "Fire Emergency",
      description: "Find nearby fire stations",
      type: "fire",
      icon: <FaFireExtinguisher />,
      color: "bg-orange-600",
    },
    {
      title: "Pharmacy Emergency",
      description: "Find nearby pharmacies and medicine stores ",
      type: "pharmacy",
      icon: <FaSearchLocation />,
      color: "bg-purple-600",
    },
    {
  title: "Multi-Stop Planner",
  description: "Plan optimized route across hospital, police, fuel and more",
  type: "multi-stop",
  icon: <FaRoute />,
  color: "bg-purple-600",
}
  ];

  const handleEmergencyClick = (type) => {
      if (type === "multi-stop") {
    navigate("/multi-stop");
    return;
  }
    navigate(`/map?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
     <section className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">
  RapidRescue Dashboard
</h1>

          <p className="text-gray-600 mt-3 text-sm md:text-lg max-w-3xl">
            Choose your emergency type and RapidRescue will find the nearest
            help, calculate the shortest route, and assist you with SOS support.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
            Select Emergency Assistance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {emergencyOptions.map((item) => (
              <EmergencyCard
                key={item.type}
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                onClick={() => handleEmergencyClick(item.type)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
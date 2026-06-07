import {
  FaHospital,
  FaShieldAlt,
  FaGasPump,
  FaFireExtinguisher,
  FaTools,
  FaSearchLocation,
} from "react-icons/fa";

export const emergencyTypes = [
  {
    id: 1,
    type: "medical",
    title: "Medical Emergency",
    description: "Find nearby hospitals and medical services",
    color: "bg-red-600",
    icon: FaHospital,
  },

  {
    id: 2,
    type: "police",
    title: "Police Assistance",
    description: "Locate nearby police stations quickly",
    color: "bg-blue-600",
    icon: FaShieldAlt,
  },

  {
    id: 3,
    type: "fuel",
    title: "Fuel Assistance",
    description: "Find nearby petrol pumps and fuel stations",
    color: "bg-green-600",
    icon: FaGasPump,
  },

  {
    id: 4,
    type: "fire",
    title: "Fire Emergency",
    description: "Locate nearby fire stations",
    color: "bg-orange-600",
    icon: FaFireExtinguisher,
  },

  {
    id: 5,
    type: "car_breakdown",
    title: "Vehicle Breakdown",
    description: "Find mechanics and roadside assistance",
    color: "bg-yellow-600",
    icon: FaTools,
  },

  {
    id: 6,
    type: "custom",
    title: "Custom Search",
    description: "Search for any nearby emergency service",
    color: "bg-purple-600",
    icon: FaSearchLocation,
  },
];

// ================= GET TYPE DETAILS =================
export const getEmergencyTypeDetails = (type) => {
  return emergencyTypes.find(
    (item) => item.type === type
  );
};
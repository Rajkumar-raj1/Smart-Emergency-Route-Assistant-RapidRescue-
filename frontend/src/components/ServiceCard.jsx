import {
  FaHospital,
  FaShieldAlt,
  FaGasPump,
  FaFireExtinguisher,
  FaTools,
  FaMapMarkerAlt,
  FaRoute,
  FaPlus,
  FaCheck,
} from "react-icons/fa";

const ServiceCard = ({
  service,
  onRouteClick,
  onSelectStop,
  isSelected = false,
  showMultiStop = false,
}) => {
  const getServiceIcon = () => {
    switch (service.type) {
      case "medical":
        return <FaHospital />;
      case "police":
        return <FaShieldAlt />;
      case "fuel":
        return <FaGasPump />;
      case "fire":
        return <FaFireExtinguisher />;
      case "car_breakdown":
        return <FaTools />;
      default:
        return <FaMapMarkerAlt />;
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 md:p-5 border w-full ${
        isSelected ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className="bg-blue-100 text-blue-600 p-3 md:p-4 rounded-full text-xl md:text-2xl flex items-center justify-center">
          {getServiceIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-bold text-gray-800 break-words">
            {service.name}
          </h2>

          <p className="text-gray-500 text-xs md:text-sm mt-1 break-words">
            {service.address}
          </p>

          <div className="flex items-center gap-2 mt-3 text-blue-600 font-semibold text-sm">
            <FaRoute />
            <span>{service.distanceKm} km away</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRouteClick(service)}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-2.5 md:py-3 rounded-xl font-semibold transition text-sm md:text-base"
      >
        View Route
      </button>

     {showMultiStop && (
  <button
    onClick={onSelectStop}
    className={`mt-3 w-full py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
      isSelected
        ? "bg-green-600 text-white hover:bg-green-700"
        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
    }`}
  >
    {isSelected ? "Selected for Multi-Stop" : "Add To Multi-Stop"}
  </button>
)}
    </div>
  );
};

export default ServiceCard;
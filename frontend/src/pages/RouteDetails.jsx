import {
  FaMapMarkerAlt,
  FaRoute,
  FaClock,
  FaLocationArrow,
} from "react-icons/fa";

const RouteDetails = ({
  selectedService,
  routeData,
}) => {
  if (!selectedService || !routeData) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-5 md:p-6">
        <p className="text-gray-500">
          Select a service to view route details.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 text-red-600 p-3 rounded-full text-2xl">
          <FaRoute />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Route Details
          </h2>

          <p className="text-gray-500 text-sm">
            RapidRescue shortest route analysis
          </p>
        </div>
      </div>

      {/* ================= DESTINATION ================= */}
      <div className="bg-gray-50 border rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <FaMapMarkerAlt />

          <span className="font-semibold">
            Destination
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800">
          {selectedService.name}
        </h3>

        <p className="text-gray-600 mt-1 text-sm">
          {selectedService.address}
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* DISTANCE */}
        <div className="bg-gray-50 border rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <FaRoute />

            <span className="font-semibold">
              Distance
            </span>
          </div>

          <p className="text-2xl font-bold text-gray-800">
            {routeData.distanceKm}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            kilometers
          </p>
        </div>

        {/* ETA */}
        <div className="bg-gray-50 border rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <FaClock />

            <span className="font-semibold">
              ETA
            </span>
          </div>

          <p className="text-2xl font-bold text-gray-800">
            {routeData.etaMinutes}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            minutes
          </p>
        </div>

        {/* TYPE */}
        <div className="bg-gray-50 border rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <FaLocationArrow />

            <span className="font-semibold">
              Service Type
            </span>
          </div>

          <p className="text-lg font-bold text-gray-800 capitalize">
            {selectedService.type?.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* ================= ADDITIONAL INFO ================= */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 text-sm md:text-base leading-relaxed">
          Follow the highlighted route on the map for the fastest path to your
          selected emergency service.
        </p>
      </div>
    </div>
  );
};

export default RouteDetails;
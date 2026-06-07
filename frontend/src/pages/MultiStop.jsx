import { useState } from "react";
import {
  FaHospital,
  FaShieldAlt,
  FaGasPump,
  FaFireExtinguisher,
  FaTools,
  FaPills,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import ServiceCard from "../components/ServiceCard";

import getCurrentLocation from "../utils/getCurrentLocation";
import { reverseGeocode } from "../api/locationApi";
import { getNearbyServices, saveEmergencyHistory } from "../api/emergencyApi";
import { optimizeMultiStopRoute } from "../api/routeApi";

const MultiStop = () => {
  const serviceTypes = [
    { type: "medical", title: "Hospital", icon: <FaHospital /> },
    { type: "police", title: "Police", icon: <FaShieldAlt /> },
    { type: "fuel", title: "Fuel", icon: <FaGasPump /> },
    { type: "car_breakdown", title: "Mechanic", icon: <FaTools /> },
    { type: "pharmacy", title: "Pharmacy", icon: <FaPills /> },
    { type: "fire", title: "Fire Station", icon: <FaFireExtinguisher /> },
  ];

  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [optimizeLoading, setOptimizeLoading] = useState(false);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const fetchCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const location = await getCurrentLocation();

      const address = await reverseGeocode(
        location.latitude,
        location.longitude
      );

      setUserLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        address,
      });
    } catch (error) {
      alert(`${error}. Try manual location search.`);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleManualLocation = async () => {
    try {
      if (!manualLocation.trim()) {
        alert("Enter location first");
        return;
      }

      setLocationLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          manualLocation
        )}&format=json&limit=1`
      );

      const data = await response.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      setUserLocation({
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        address: data[0].display_name,
      });

      setServices([]);
      setSelectedStops([]);
      setOptimizedRoute(null);
      setRouteCoordinates([]);
    } catch (error) {
      alert("Failed to search location");
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchSelectedServices = async () => {
    try {
      if (!userLocation) {
        alert("Select current/manual location first");
        return;
      }

      if (selectedTypes.length === 0) {
        alert("Select at least one service type");
        return;
      }

      setServicesLoading(true);
      setServices([]);
      setSelectedStops([]);
      setOptimizedRoute(null);
      setRouteCoordinates([]);

      let allServices = [];

      for (const type of selectedTypes) {
        const response = await getNearbyServices({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          emergencyType: type,
          radius: 5000,
        });

        allServices = [
          ...allServices,
          ...(response.data.services || []),
        ];
      }

      setServices(allServices);

      if (allServices.length === 0) {
        alert("No services found. Try another location or fewer service types.");
      }
    } catch (error) {
      alert(error?.message || "Failed to fetch services");
    } finally {
      setServicesLoading(false);
    }
  };

  const toggleStopSelection = (service) => {
    const exists = selectedStops.find((item) => item.id === service.id);

    if (exists) {
      setSelectedStops(
        selectedStops.filter((item) => item.id !== service.id)
      );
      return;
    }

    if (selectedStops.length >= 6) {
      alert("Maximum 6 stops allowed");
      return;
    }

    setSelectedStops([...selectedStops, service]);
  };

  const handleOptimizeRoute = async () => {
    try {
      if (!userLocation) {
        alert("Location not found");
        return;
      }

      if (selectedStops.length < 2) {
        alert("Select at least 2 stops");
        return;
      }

      setOptimizeLoading(true);

      const response = await optimizeMultiStopRoute({
        startLat: userLocation.latitude,
        startLng: userLocation.longitude,
        stops: selectedStops.map((stop) => ({
          latitude: stop.latitude,
          longitude: stop.longitude,
          name: stop.name,
          type: stop.type,
        })),
      });

      const result = response.data;

      setOptimizedRoute(result);
      await saveEmergencyHistory({
  emergencyType: "multi_stop",
  userLocation: {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    address: userLocation.address,
  },
  selectedService: {
    name: "Multi-Stop Emergency Route",
    type: "multi_stop",
    latitude: selectedStops[0].latitude,
    longitude: selectedStops[0].longitude,
    address: `${selectedStops.length} stops selected`,
    distanceKm: result.fullRoute?.distanceKm,
  },
  optimizedStops: selectedStops.map((stop) => ({
    name: stop.name,
    type: stop.type,
    latitude: stop.latitude,
    longitude: stop.longitude,
    address: stop.address,
  })),
  routeDetails: {
    distance: result.fullRoute?.distanceKm,
    eta: result.fullRoute?.durationMin,
  },
});

      if (result.fullRoute?.geometry?.coordinates) {
        const convertedCoordinates =
          result.fullRoute.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );

        setRouteCoordinates(convertedCoordinates);
      }
    } catch (error) {
      alert(error?.message || "Route optimization failed");
    } finally {
      setOptimizeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Multi-Stop Emergency Planner
          </h1>

          <p className="text-slate-600 mt-3 text-sm md:text-lg max-w-3xl">
            Select different emergency services and RapidRescue will optimize
            the best route order using your multi-stop route API.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={fetchCurrentLocation}
              disabled={locationLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold"
            >
              {locationLoading ? "Getting Location..." : "Use Current Location"}
            </button>

            <input
              type="text"
              placeholder="Search location e.g. MANIT Bhopal"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="md:col-span-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleManualLocation}
              disabled={locationLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold"
            >
              Search Location
            </button>
          </div>

          {userLocation && (
            <p className="text-blue-600 font-semibold mt-4 text-sm">
              📍 {userLocation.address}
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-md p-5 md:p-6 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
            Select Service Types
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceTypes.map((item) => {
              const active = selectedTypes.includes(item.type);

              return (
                <button
                  key={item.type}
                  onClick={() => toggleType(item.type)}
                  className={`rounded-2xl border p-4 flex flex-col items-center gap-3 transition ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-bold text-sm">{item.title}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchSelectedServices}
            disabled={servicesLoading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold"
          >
            {servicesLoading ? "Finding Services..." : "Find Selected Services"}
          </button>
        </section>

        {optimizedRoute && (
          <section className="bg-white rounded-2xl shadow-md p-5 md:p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-4">
              Optimized Route Order
            </h2>

            <div className="space-y-3">
              {optimizedRoute.optimizedStops?.map((stop, index) => (
                <div
                  key={index}
                  className="border border-purple-200 bg-purple-50 rounded-xl p-4"
                >
                  <p className="font-bold text-slate-900">
                    Stop {index + 1}: {stop.name || "Emergency Stop"}
                  </p>

                  <p className="text-sm text-slate-600 capitalize">
                    {stop.type?.replace("_", " ") || "Service"}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div className="bg-slate-50 rounded-xl p-4 border">
                <p className="text-slate-500">Total Distance</p>
                <p className="font-bold text-slate-900">
                  {optimizedRoute.fullRoute?.distanceKm} km
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border">
                <p className="text-slate-500">Estimated Time</p>
                <p className="font-bold text-slate-900">
                  {optimizedRoute.fullRoute?.durationMin} min
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <MapComponent
              userLocation={userLocation}
              services={selectedStops.length > 0 ? selectedStops : services}
              routeCoordinates={routeCoordinates}
              selectedService={null}
            />
          </section>

          <section className="bg-white rounded-2xl shadow-md p-5 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
              Services Found
            </h2>

            <button
              onClick={handleOptimizeRoute}
              disabled={selectedStops.length < 2 || optimizeLoading}
              className="mb-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
            >
              {optimizeLoading
                ? "Optimizing..."
                : `Optimize Route (${selectedStops.length})`}
            </button>

            {services.length === 0 ? (
              <p className="text-slate-500">
                Select service types and find services.
              </p>
            ) : (
              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
                {services.map((service) => (
                  <ServiceCard
                    key={`${service.type}-${service.id}`}
                    service={service}
                    onRouteClick={() => toggleStopSelection(service)}
                    onSelectStop={() => toggleStopSelection(service)}
                    isSelected={selectedStops.some(
                      (stop) => stop.id === service.id
                    )}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MultiStop;
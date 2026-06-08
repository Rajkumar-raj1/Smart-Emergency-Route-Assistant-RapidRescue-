import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt, FaRoute, FaClock } from "react-icons/fa";

import { reverseGeocode } from "../api/locationApi";
import Navbar from "../components/Navbar";
import MapComponent from "../components/MapComponent";
import ServiceCard from "../components/ServiceCard";
import SOSButton from "../components/SOSButton";
import { useAuth } from "../context/AuthContext";
import getCurrentLocation from "../utils/getCurrentLocation";
import { getShortestRoute } from "../api/routeApi";
import { getNearbyServices, saveEmergencyHistory } from "../api/emergencyApi";

const MapPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const emergencyType = searchParams.get("type") || "medical";

  const [showSOSContacts, setShowSOSContacts] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [sosLoading] = useState(false);

  const searchLocationByName = async (query) => {
    const searches = [
      query,
      `${query}, Bhopal`,
      `${query}, Madhya Pradesh`,
      `${query}, India`,
    ];

    for (const searchText of searches) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchText
        )}&format=json&limit=5&countrycodes=in&addressdetails=1`
      );

      const data = await response.json();

      if (data?.length > 0) {
        const bestResult =
          data.find((item) =>
            item.display_name.toLowerCase().includes(query.toLowerCase())
          ) || data[0];

        return {
          latitude: parseFloat(bestResult.lat),
          longitude: parseFloat(bestResult.lon),
          address: bestResult.display_name,
        };
      }
    }

    return null;
  };

  const fetchNearbyForLocation = async (location) => {
    try {
      setError("");
      setLoading(true);
      setSelectedService(null);
      setRouteData(null);
      setRouteCoordinates([]);
      setServices([]);

      const radiusList = [5000, 10000, 20000, 50000];
      let fetchedServices = [];

      for (const radius of radiusList) {
        const response = await getNearbyServices({
          latitude: location.latitude,
          longitude: location.longitude,
          emergencyType,
          radius,
        });

        fetchedServices = response.data.services || [];

        if (fetchedServices.length > 0) break;
      }

      setServices(fetchedServices);

      if (fetchedServices.length === 0) {
        setError(
          "No nearby services found even in a larger area. Try another emergency type or a nearby city/landmark."
        );
      }
    } catch (error) {
      console.error(error);
      setServices([]);
      setError(
        "Unable to find nearby services. Please check internet/backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setError("");

      const location = await getCurrentLocation();

      let address = "Current Location";
      try {
        address = await reverseGeocode(location.latitude, location.longitude);
      } catch {
        address = `${location.latitude}, ${location.longitude}`;
      }

      const currentLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
      };

      setUserLocation(currentLocation);
      await fetchNearbyForLocation(currentLocation);
    } catch (error) {
      console.error(error);
      setError(
        "Location permission denied or location unavailable. Please search location manually."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleManualLocation = async () => {
    try {
      if (!manualLocation.trim()) {
        setError("Please enter a location first.");
        return;
      }

      setError("");
      setLocationLoading(true);
      setServices([]);
      setSelectedService(null);
      setRouteData(null);
      setRouteCoordinates([]);

      const location = await searchLocationByName(manualLocation.trim());

      if (!location) {
        setError("Location not found. Try writing city/state also.");
        return;
      }

      setUserLocation(location);
      await fetchNearbyForLocation(location);
    } catch (error) {
      console.error(error);
      setError("Failed to search location. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRoute = async (service) => {
    try {
      if (!userLocation) {
        setError("Current location not found.");
        return;
      }

      setError("");
      setSelectedService(service);

      const response = await getShortestRoute({
        startLat: userLocation.latitude,
        startLng: userLocation.longitude,
        destinationLat: service.latitude,
        destinationLng: service.longitude,
      });

      const route = response.data;
      setRouteData(route);

      try {
        await saveEmergencyHistory({
          emergencyType,
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            address: userLocation.address,
          },
          selectedService: {
            name: service.name,
            type: service.type,
            latitude: service.latitude,
            longitude: service.longitude,
            address: service.address,
            distanceKm: service.distanceKm,
          },
          routeDetails: {
            distance: route.distanceKm,
            eta: route.etaMinutes,
          },
        });
      } catch (historyError) {
        console.error("History save failed:", historyError);
      }

      if (route.geometry?.coordinates) {
        const convertedCoordinates = route.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        setRouteCoordinates(convertedCoordinates);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to generate route. Please try another service.");
    }
  };

  const handleSOS = () => {
    if (!userLocation) {
      setError("Current location not found.");
      return;
    }

    if (!user?.emergencyContacts?.length) {
      setError("No emergency contacts found. Please add contacts in Profile.");
      return;
    }

    setShowSOSContacts(true);
  };

  const sendWhatsAppToContact = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");

    const phoneWithCountryCode = cleanPhone.startsWith("91")
      ? cleanPhone
      : `91${cleanPhone}`;

    const message = encodeURIComponent(
      `🚨 Emergency Alert from RapidRescue

I need immediate help.

Current Location:
https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}

Address:
${userLocation.address}`
    );

    window.open(
      `https://wa.me/${phoneWithCountryCode}?text=${message}`,
      "_blank"
    );

    setShowSOSContacts(false);
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyForLocation(userLocation);
    }
  }, [emergencyType]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-2xl shadow-md p-5 md:p-7 mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 capitalize">
            {emergencyType.replace("_", " ")} Assistance
          </h1>

          <p className="text-gray-600 mt-3 text-sm md:text-lg">
            RapidRescue is using your location to find nearby emergency
            services.
          </p>

          <div className="mt-5 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search location e.g. MANIT Bhopal, Raisen MP, Sehore MP"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleManualLocation();
              }}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            />

            <button
              onClick={handleManualLocation}
              disabled={locationLoading || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {locationLoading ? "Searching..." : "Search Location"}
            </button>
          </div>

          {userLocation && (
            <p className="text-sm text-blue-600 font-semibold mt-3">
              📍 {userLocation.address}
            </p>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}
        </section>

        {routeData && selectedService && (
          <section className="bg-white rounded-2xl shadow-md p-5 md:p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
              Route Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaMapMarkerAlt />
                  <span className="font-semibold">Destination</span>
                </div>
                <p className="font-bold text-gray-800">
                  {selectedService.name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaRoute />
                  <span className="font-semibold">Distance</span>
                </div>
                <p className="font-bold text-gray-800">
                  {routeData.distanceKm} km
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaClock />
                  <span className="font-semibold">ETA</span>
                </div>
                <p className="font-bold text-gray-800">
                  {routeData.etaMinutes} min
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            {locationLoading ? (
              <div className="h-[350px] md:h-[500px] bg-white rounded-2xl shadow-md flex items-center justify-center">
                <p className="text-gray-600 font-semibold">
                  Searching location...
                </p>
              </div>
            ) : (
              <MapComponent
                userLocation={userLocation}
                services={services}
                routeCoordinates={routeCoordinates}
                selectedService={selectedService}
              />
            )}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-md p-5 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
                Nearby Services
              </h2>

              {loading ? (
                <p className="text-gray-500">
                  Searching nearby services in larger area...
                </p>
              ) : services.length === 0 ? (
                <p className="text-gray-500">
                  No nearby services found. Try a nearby city or landmark.
                </p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id || `${service.name}-${service.latitude}`}
                      service={service}
                      onRouteClick={handleRoute}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SOSButton onClick={handleSOS} loading={sosLoading} />

      {showSOSContacts && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000] px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Select Emergency Contact
            </h2>

            <p className="text-gray-600 mb-5">
              Choose a contact to send SOS on WhatsApp.
            </p>

            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {user?.emergencyContacts?.map((contact) => (
                <button
                  key={contact._id || contact.phone}
                  onClick={() => sendWhatsAppToContact(contact.phone)}
                  className="w-full text-left border rounded-xl p-4 hover:bg-green-50 hover:border-green-500 transition"
                >
                  <h3 className="font-bold text-gray-800">{contact.name}</h3>

                  <p className="text-sm text-gray-500">
                    {contact.relation || "Emergency Contact"}
                  </p>

                  <p className="text-green-600 font-semibold mt-1">
                    {contact.phone}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSOSContacts(false)}
              className="mt-5 w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
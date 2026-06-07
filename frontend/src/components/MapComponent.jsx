import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ================= DEFAULT LEAFLET ICON FIX =================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ================= CUSTOM ICONS =================
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const serviceIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedDestinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ================= MAP AUTO UPDATE =================
const MapUpdater = ({ userLocation, routeCoordinates, selectedService }) => {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates.length > 0) {
      map.fitBounds(routeCoordinates, {
        padding: [50, 50],
      });
    } else if (selectedService && userLocation) {
      map.fitBounds(
        [
          [userLocation.latitude, userLocation.longitude],
          [selectedService.latitude, selectedService.longitude],
        ],
        {
          padding: [50, 50],
        }
      );
    } else if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 15);
    }
  }, [userLocation, routeCoordinates, selectedService, map]);

  return null;
};

const MapComponent = ({
  userLocation,
  services = [],
  routeCoordinates = [],
  selectedService,
}) => {
  if (!userLocation) {
    return (
      <div className="h-[350px] sm:h-[420px] md:h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl shadow-md">
        <p className="text-gray-500 text-lg font-medium">
          Loading map...
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[350px] sm:h-[420px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* ================= LEGEND ================= */}
      <div className="absolute top-3 left-3 z-[1000] bg-white shadow-md rounded-xl px-4 py-3 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="font-semibold text-gray-700">Your Location</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          <span className="font-semibold text-gray-700">Nearby Service</span>
        </div>

        {selectedService && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="font-semibold text-gray-700">
              Selected Destination
            </span>
          </div>
        )}
      </div>

      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <MapUpdater
          userLocation={userLocation}
          routeCoordinates={routeCoordinates}
          selectedService={selectedService}
        />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ================= USER LOCATION ================= */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold text-blue-600 text-lg">
                📍 Your Current Location
              </h3>

              <p className="text-sm text-gray-700 mt-1">
                {userLocation.address || "Current Location"}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* ================= SERVICES ================= */}
        {services.map((service) => {
          const isSelected =
            selectedService && selectedService.id === service.id;

          return (
            <Marker
              key={service.id}
              position={[service.latitude, service.longitude]}
              icon={isSelected ? selectedDestinationIcon : serviceIcon}
            >
              <Popup>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      isSelected ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isSelected ? "🎯 Selected Destination" : "Nearby Service"}
                  </h3>

                  <p className="font-semibold text-gray-800 mt-1">
                    {service.name}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {service.address}
                  </p>

                  <p className="text-blue-600 font-bold mt-2">
                    {service.distanceKm} km away
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ================= ROUTE LINE ================= */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#2563eb",
              weight: 6,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
import { useState } from "react";
import {
  FaBell,
  FaMapMarkerAlt,
  FaCopy,
  FaWhatsapp,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import { sendSOS } from "../api/sosApi";
import { useAuth } from "../context/AuthContext";
import getCurrentLocation from "../utils/getCurrentLocation";
import { reverseGeocode } from "../api/locationApi";

const SOS = () => {
  const { user } = useAuth();

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [sosLoading, setSOSLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLocationLoading(true);

      const currentPosition = await getCurrentLocation();

      const address = await reverseGeocode(
        currentPosition.latitude,
        currentPosition.longitude
      );

      const currentLocation = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        address,
      };

      setLocation(currentLocation);

      setMessage(
        `🚨 Emergency Alert from RapidRescue

${user?.fullName || "A RapidRescue user"} needs immediate help.

Current Location:
https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}

Address:
${currentLocation.address}`
      );
    } catch (error) {
      alert(`${error}. Please allow location permission or enter location manually.`);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSendSOS = async () => {
    if (!location) {
      alert("Please get your current location first");
      return;
    }

    try {
      setSOSLoading(true);

      await sendSOS({
        emergencyType: "custom",
        message:
          message || "Emergency alert from RapidRescue. I need immediate help.",
        location,
      });

      alert("SOS saved successfully. Now choose a WhatsApp contact to send it.");
    } catch (error) {
      alert(error?.message || "Failed to save SOS");
    } finally {
      setSOSLoading(false);
    }
  };

  const copyMessage = async () => {
    if (!message) {
      alert("Please get your location first");
      return;
    }

    await navigator.clipboard.writeText(message);
    alert("SOS message copied");
  };

  const openWhatsApp = (phone) => {
    if (!message) {
      alert("Please get your current location first");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const phoneWithCountryCode = cleanPhone.startsWith("91")
      ? cleanPhone
      : `91${cleanPhone}`;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const openGenericWhatsApp = () => {
    if (!message) {
      alert("Please get your current location first");
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-3xl">
              <FaBell />
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                RapidRescue SOS
              </h1>

              <p className="text-gray-600 mt-2">
                Generate an emergency message and send it to your saved contacts
                through WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <button
            onClick={getLocation}
            disabled={locationLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <FaMapMarkerAlt />
            {locationLoading ? "Getting Location..." : "Get Current Location"}
          </button>

          {location && (
            <div className="mt-5 bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold text-gray-800">Location Found</p>

              <p className="text-gray-600 text-sm mt-1">
                Latitude: {location.latitude}
              </p>

              <p className="text-gray-600 text-sm">
                Longitude: {location.longitude}
              </p>

              <p className="text-blue-600 text-sm font-semibold mt-2">
                📍 {location.address}
              </p>
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="SOS message will appear here..."
            rows="6"
            className="w-full mt-5 border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <button
              onClick={handleSendSOS}
              disabled={sosLoading}
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
            >
              {sosLoading ? "Saving..." : "Save SOS"}
            </button>

            <button
              onClick={copyMessage}
              disabled={!message}
              className="bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <FaCopy />
              Copy
            </button>

            <button
              onClick={openGenericWhatsApp}
              disabled={!message}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              WhatsApp
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Saved Emergency Contacts
            </h2>

            {!user?.emergencyContacts?.length ? (
              <div className="bg-gray-50 border rounded-xl p-4 text-gray-500">
                No emergency contacts found. Please add contacts from Profile.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.emergencyContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-gray-50 border rounded-xl p-4"
                  >
                    <h3 className="font-bold text-gray-800">
                      {contact.name}
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {contact.relation || "Emergency Contact"}
                    </p>

                    <p className="text-blue-600 font-semibold mt-2">
                      {contact.phone}
                    </p>

                    <button
                      onClick={() => openWhatsApp(contact.phone)}
                      disabled={!message}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp />
                      Send SOS on WhatsApp
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SOS;
import { useEffect, useState } from "react";
import {
  FaHistory,
  FaMapMarkerAlt,
  FaRoute,
  FaBell,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import { getEmergencyHistory } from "../api/emergencyApi";
import { getSOSLogs } from "../api/sosApi";

const History = () => {
  const [emergencyHistory, setEmergencyHistory] = useState([]);
  const [sosLogs, setSOSLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("emergency");

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const emergencyResponse = await getEmergencyHistory();
      const sosResponse = await getSOSLogs();

      setEmergencyHistory(emergencyResponse.data || []);
      setSOSLogs(sosResponse.data || []);
    } catch (error) {
      alert(error?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-3xl">
              <FaHistory />
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">
                RapidRescue History
              </h1>

              <p className="text-slate-600 mt-2 text-sm md:text-lg">
                View your past emergency searches and SOS alerts.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-2xl shadow-md p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("emergency")}
            className={`flex-1 py-3 rounded-xl font-bold transition ${
              activeTab === "emergency"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Emergency Searches ({emergencyHistory.length})
          </button>

          <button
            onClick={() => setActiveTab("sos")}
            className={`flex-1 py-3 rounded-xl font-bold transition ${
              activeTab === "sos"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            SOS History ({sosLogs.length})
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 font-medium mt-4">
              Loading history...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "emergency" && (
              <section className="bg-white rounded-2xl shadow-md p-5 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
                  Emergency Searches
                </h2>

                {emergencyHistory.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 font-semibold">
                    No emergency history found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emergencyHistory.map((item) => (
                      <div
                        key={item._id}
                        className="border border-slate-200 rounded-xl p-4 bg-slate-50"
                      >
                        <h3 className="font-bold text-slate-900 capitalize">
                          {item.emergencyType?.replace("_", " ")}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>

                        {item.userLocation && (
                          <p className="flex items-start gap-2 text-sm text-slate-600 mt-3">
                            <FaMapMarkerAlt className="text-blue-600 mt-1 shrink-0" />
                            <span>
                              {item.userLocation.address ||
                                "Location saved"}
                            </span>
                          </p>
                        )}

                        {item.selectedService?.name && (
                          <p className="text-sm text-slate-700 mt-2">
                            Service:{" "}
                            <span className="font-semibold">
                              {item.selectedService.name}
                            </span>
                          </p>
                        )}

                        {item.optimizedStops?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-bold text-purple-700">
                              Optimized Stops:
                            </p>

                            <div className="mt-2 space-y-1">
                              {item.optimizedStops.map((stop, index) => (
                                <p
                                  key={index}
                                  className="text-sm text-slate-600"
                                >
                                  {index + 1}. {stop.name}{" "}
                                  <span className="capitalize">
                                    ({stop.type?.replace("_", " ")})
                                  </span>
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.routeDetails && (
                          <p className="flex items-center gap-2 text-sm text-blue-600 font-semibold mt-3">
                            <FaRoute />
                            {item.routeDetails.distance} km, ETA{" "}
                            {item.routeDetails.eta} min
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "sos" && (
              <section className="bg-white rounded-2xl shadow-md p-5 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
                  SOS Alerts
                </h2>

                {sosLogs.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 font-semibold">
                    No SOS logs found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sosLogs.map((log) => (
                      <div
                        key={log._id}
                        className="border border-slate-200 rounded-xl p-4 bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <FaBell className="text-red-600" />

                          <h3 className="font-bold text-slate-900 capitalize">
                            {log.emergencyType?.replace("_", " ")}
                          </h3>
                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>

                        <p className="text-sm text-slate-700 mt-3 break-words">
                          {log.message}
                        </p>

                        {log.location?.googleMapsLink && (
                          <a
                            href={log.location.googleMapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-3 text-blue-600 font-semibold text-sm hover:underline"
                          >
                            Open Location
                          </a>
                        )}

                        <p className="text-sm mt-2">
                          Status:{" "}
                          <span className="font-semibold text-green-600">
                            {log.status}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default History;
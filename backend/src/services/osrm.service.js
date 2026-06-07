import axios from "axios";

const OSRM_BASE_URL = "https://router.project-osrm.org";

const getRouteFromOSRM = async (startLocation, destinationLocation) => {
  const { latitude: startLat, longitude: startLng } = startLocation;
  const { latitude: destLat, longitude: destLng } = destinationLocation;

  const url = `${OSRM_BASE_URL}/route/v1/driving/${startLng},${startLat};${destLng},${destLat}`;

  const response = await axios.get(url, {
    params: {
      overview: "full",
      geometries: "geojson",
      steps: true,
    },
  });

  const route = response.data.routes?.[0];

  if (!route) {
    return null;
  }

  return {
    distanceMeters: route.distance,
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    etaSeconds: route.duration,
    etaMinutes: Math.ceil(route.duration / 60),
    geometry: route.geometry,
    steps: route.legs?.[0]?.steps || [],
  };
};

const getMultiStopRouteFromOSRM = async (locations = []) => {
  if (locations.length < 2) {
    return null;
  }

  const coordinates = locations
    .map((loc) => `${loc.longitude},${loc.latitude}`)
    .join(";");

  const url = `${OSRM_BASE_URL}/route/v1/driving/${coordinates}`;

  const response = await axios.get(url, {
    params: {
      overview: "full",
      geometries: "geojson",
      steps: true,
    },
  });

  const route = response.data.routes?.[0];

  if (!route) {
    return null;
  }

  return {
    distanceMeters: route.distance,
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    etaSeconds: route.duration,
    etaMinutes: Math.ceil(route.duration / 60),
    geometry: route.geometry,
    legs: route.legs || [],
  };
};

export { getRouteFromOSRM, getMultiStopRouteFromOSRM };
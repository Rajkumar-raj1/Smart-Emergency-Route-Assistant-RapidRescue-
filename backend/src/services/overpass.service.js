import axios from "axios";

const OVERPASS_URLS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

const emergencyTypeQueries = {
  medical: `
    node["amenity"~"hospital|clinic|doctors"](around:RADIUS,LAT,LNG);
    way["amenity"~"hospital|clinic|doctors"](around:RADIUS,LAT,LNG);
    node["healthcare"~"hospital|clinic|doctor"](around:RADIUS,LAT,LNG);
    way["healthcare"~"hospital|clinic|doctor"](around:RADIUS,LAT,LNG);
  `,
  police: `
    node["amenity"="police"](around:RADIUS,LAT,LNG);
    way["amenity"="police"](around:RADIUS,LAT,LNG);
  `,
  fuel: `
    node["amenity"="fuel"](around:RADIUS,LAT,LNG);
    way["amenity"="fuel"](around:RADIUS,LAT,LNG);
  `,
  fire: `
    node["amenity"="fire_station"](around:RADIUS,LAT,LNG);
    way["amenity"="fire_station"](around:RADIUS,LAT,LNG);
  `,
  car_breakdown: `
    node["shop"~"car_repair|tyres"](around:RADIUS,LAT,LNG);
    way["shop"~"car_repair|tyres"](around:RADIUS,LAT,LNG);
    node["amenity"="vehicle_repair"](around:RADIUS,LAT,LNG);
    way["amenity"="vehicle_repair"](around:RADIUS,LAT,LNG);
  `,
  pharmacy: `
    node["amenity"="pharmacy"](around:RADIUS,LAT,LNG);
    way["amenity"="pharmacy"](around:RADIUS,LAT,LNG);
    node["healthcare"="pharmacy"](around:RADIUS,LAT,LNG);
    way["healthcare"="pharmacy"](around:RADIUS,LAT,LNG);
  `,
};

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildOverpassQuery = (latitude, longitude, emergencyType, radius) => {
  const queryPart = emergencyTypeQueries[emergencyType];

  if (!queryPart) {
    throw new Error("Invalid emergency type");
  }

  const finalQueryPart = queryPart
    .replaceAll("RADIUS", radius)
    .replaceAll("LAT", latitude)
    .replaceAll("LNG", longitude);

  return `
[out:json][timeout:12];
(
${finalQueryPart}
);
out center tags;
`;
};

const fetchFromOverpass = async (
  url,
  latitude,
  longitude,
  emergencyType,
  radius
) => {
  const query = buildOverpassQuery(latitude, longitude, emergencyType, radius);

  const response = await axios.post(
    url,
    new URLSearchParams({ data: query }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "RapidRescue/1.0",
      },
      timeout: 12000,
    }
  );

  return response.data.elements || [];
};

const formatServices = (elements, latitude, longitude, emergencyType) => {
  const uniqueMap = new Map();

  elements.forEach((place) => {
    const lat = place.lat || place.center?.lat;
    const lng = place.lon || place.center?.lon;

    if (!lat || !lng) return;

    const id = `${place.type}-${place.id}`;
    if (uniqueMap.has(id)) return;

    const distanceKm = getDistanceKm(
      Number(latitude),
      Number(longitude),
      Number(lat),
      Number(lng)
    );

    uniqueMap.set(id, {
      id,
      name: place.tags?.name || "Unknown Service",
      type: emergencyType,
      latitude: lat,
      longitude: lng,
      distanceKm: Number(distanceKm.toFixed(2)),
      address:
        place.tags?.["addr:full"] ||
        place.tags?.["addr:street"] ||
        place.tags?.["addr:city"] ||
        place.tags?.operator ||
        "Address not available",
    });
  });

  return Array.from(uniqueMap.values()).sort(
    (a, b) => a.distanceKm - b.distanceKm
  );
};

const fetchNearbyServices = async (
  latitude,
  longitude,
  emergencyType,
  radius = 5000
) => {
  const radiusList = [Number(radius), 10000, 20000, 50000];

  let lastError = null;

  for (const currentRadius of radiusList) {
    const requests = OVERPASS_URLS.map((url) =>
      fetchFromOverpass(
        url,
        latitude,
        longitude,
        emergencyType,
        currentRadius
      )
    );

    const results = await Promise.allSettled(requests);

    const allElements = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    if (allElements.length > 0) {
      return formatServices(allElements, latitude, longitude, emergencyType);
    }

    const failedResult = results.find((result) => result.status === "rejected");
    if (failedResult) {
      lastError = failedResult.reason;
    }
  }

  console.log("No services found after all radius checks", lastError?.message);
  return [];
};

export { fetchNearbyServices };
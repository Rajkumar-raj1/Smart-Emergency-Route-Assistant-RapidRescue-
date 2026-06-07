import axios from "axios";

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

const emergencyTypeToTag = {
  medical: { key: "amenity", value: "hospital" },
  police: { key: "amenity", value: "police" },
  fuel: { key: "amenity", value: "fuel" },
  fire: { key: "amenity", value: "fire_station" },
  car_breakdown: { key: "shop", value: "car_repair" },
  pharmacy: { key: "amenity", value: "pharmacy" },
};

const buildOverpassQuery = (
  latitude,
  longitude,
  emergencyType,
  radius = 2000
) => {
  const tag = emergencyTypeToTag[emergencyType];

  if (!tag) {
    throw new Error("Invalid emergency type");
  }

  return `
[out:json][timeout:15];
(
  node["${tag.key}"="${tag.value}"](around:${radius},${latitude},${longitude});
  way["${tag.key}"="${tag.value}"](around:${radius},${latitude},${longitude});
);
out center tags;
`;
};

const fetchNearbyServices = async (
  latitude,
  longitude,
  emergencyType,
  radius = 2000
) => {
  const query = buildOverpassQuery(
    latitude,
    longitude,
    emergencyType,
    radius
  );

  let lastError = null;

  for (const url of OVERPASS_URLS) {
    try {
      const response = await axios.post(
        url,
        new URLSearchParams({ data: query }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "RapidRescue/1.0",
          },
          timeout: 20000,
        }
      );

      const services = response.data.elements
        .map((place) => {
          const lat = place.lat || place.center?.lat;
          const lng = place.lon || place.center?.lon;

          if (!lat || !lng) return null;

          return {
            id: place.id,
            name: place.tags?.name || "Unknown Service",
            type: emergencyType,
            latitude: lat,
            longitude: lng,
            address:
              place.tags?.["addr:full"] ||
              place.tags?.["addr:street"] ||
              place.tags?.["addr:city"] ||
              "Address not available",
          };
        })
        .filter(Boolean);

      return services;
    } catch (error) {
      lastError = error;
      console.log(`Overpass failed: ${url}`);
    }
  }

  throw lastError;
};

export { fetchNearbyServices };
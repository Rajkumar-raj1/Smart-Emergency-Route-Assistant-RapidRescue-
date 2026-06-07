import axios from "axios";

export const reverseGeocode = async (lat, lng) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
    }
  );

  return response.data.display_name;
};
import axiosInstance from "./axios";

// ================= GET SHORTEST ROUTE =================
export const getShortestRoute = async ({
  startLat,
  startLng,
  destinationLat,
  destinationLng,
}) => {
  try {
    const response = await axiosInstance.get("/routes/shortest", {
      params: {
        startLat,
        startLng,
        destinationLat,
        destinationLng,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================= OPTIMIZE MULTI-STOP ROUTE =================
export const optimizeMultiStopRoute = async (routeData) => {
  try {
    const response = await axiosInstance.post(
      "/routes/multistop",
      routeData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
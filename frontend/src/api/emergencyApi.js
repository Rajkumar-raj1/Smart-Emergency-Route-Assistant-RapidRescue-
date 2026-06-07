import axiosInstance from "./axios";

// ================= GET NEARBY SERVICES =================
export const getNearbyServices = async ({
  latitude,
  longitude,
  emergencyType,
  radius = 3000,
}) => {
  try {
    const response = await axiosInstance.get("/emergency/nearby", {
      params: {
        latitude,
        longitude,
        emergencyType,
        radius,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================= SAVE EMERGENCY HISTORY =================
export const saveEmergencyHistory = async (historyData) => {
  try {
    const response = await axiosInstance.post(
      "/emergency/history",
      historyData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================= GET EMERGENCY HISTORY =================
export const getEmergencyHistory = async () => {
  try {
    const response = await axiosInstance.get("/emergency/history");

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
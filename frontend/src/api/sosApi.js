import axiosInstance from "./axios";

// ================= SEND SOS =================
export const sendSOS = async (sosData) => {
  try {
    const response = await axiosInstance.post(
      "/sos/send",
      sosData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================= GET SOS LOGS =================
export const getSOSLogs = async () => {
  try {
    const response = await axiosInstance.get("/sos/logs");

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
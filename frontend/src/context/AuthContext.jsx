import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= REGISTER =================
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post(
        "/users/register",
        userData
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      setUser(response.data.data.user);

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");

      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= GET CURRENT USER =================
  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(
        "/users/current-user"
      );

      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE LOCATION =================
  const updateLocation = async (locationData) => {
    try {
      const response = await axiosInstance.patch(
        "/users/update-location",
        locationData
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  
    // ================= UPDATE PROFILE =================
    const updateProfile = async (profileData) => {
  const response = await axiosInstance.patch("/users/update-profile", profileData);
  setUser(response.data.data);
  return response.data;
};

const addEmergencyContact = async (contactData) => {
  const response = await axiosInstance.post("/users/emergency-contacts", contactData);
  setUser(response.data.data);
  return response.data;
};

const deleteEmergencyContact = async (contactId) => {
  const response = await axiosInstance.delete(
    `/users/emergency-contacts/${contactId}`
  );
  setUser(response.data.data);
  return response.data;
};
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getCurrentUser,
        updateLocation,
        updateProfile,
        addEmergencyContact,
        deleteEmergencyContact,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">
          Loading RapidRescue...
        </h1>
      </div>
    );
  }

  // ================= NOT LOGGED IN =================
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ================= AUTHORIZED =================
  return children;
};

export default ProtectedRoute;
import { Routes, Route } from "react-router-dom";
import MultiStop from "./pages/MultiStop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import History from "./pages/History";
import Profile from "./pages/Profile";
import SOS from "./pages/SOS";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
<Route
  path="/multi-stop"
  element={
    <ProtectedRoute>
      <MultiStop />
    </ProtectedRoute>
  }
/>
      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <SOS />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
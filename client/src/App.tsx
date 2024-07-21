import { Route, Routes } from "react-router-dom";
import Index from "./Pages/Index/Index";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import "./index.css";
import { UserContext } from "./context/userContext";
import { useContext, useEffect } from "react";
import api from "./utils/api";
import Auth from "./Pages/Auth/Auth";

function App() {
  const { setUserInfo } = useContext(UserContext) as any;

  const getProfile = async () => {
    const response = await api.get("/auth/profile");
    setUserInfo(response.data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <ProtectedRoute>
            <Auth />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

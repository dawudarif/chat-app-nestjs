import { Route, Routes } from "react-router-dom";
import Index from "./Pages/Index/Index";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<ProtectedRoute />} />
      {/* Add more routes here */}
    </Routes>
  );
}

export default App;

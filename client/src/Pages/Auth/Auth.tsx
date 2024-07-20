import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";

export default function Auth() {
  const navigate = useNavigate();
  const [pageType, setPageType] = useState<"login" | "register">("login");

  const handlePageChange = () => {
    setPageType(pageType === "login" ? "register" : "login");
  };

  const state = false;

  if (state) {
    navigate("/");
  }

  if (pageType === "login") {
    return <Login setPageType={handlePageChange} />;
  }

  return <Register setPageType={handlePageChange} />;
}

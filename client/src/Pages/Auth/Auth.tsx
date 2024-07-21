import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const { userInfo } = useContext(UserContext) as any;

  if (userInfo?.email) {
    navigate("/");
  }

  if (page === "register") {
    return <Register />;
  }

  return <Login />;
}

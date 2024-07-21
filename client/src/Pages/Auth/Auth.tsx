import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../../components/Auth/Login";
import Register from "../../components/Auth/Register";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const state = false;

  if (state) {
    navigate("/");
  }

  if (page === "register") {
    return <Register />;
  }

  return <Login />;
}

import Auth from "../../Pages/Auth/Auth";
import Index from "../../Pages/Index/Index";

export default function ProtectedRoute() {
  const index = true;
  if (index) {
    return <Auth />;
  } else {
    return <Index />;
  }
}

import { useContext } from "react";
import Auth from "../../Pages/Auth/Auth";
import { UserContext } from "../../context/userContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useContext(UserContext) as any;

  if (userInfo?.email) {
    return <>{children}</>;
  } else {
    return <Auth />;
  }
}

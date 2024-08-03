"use client";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../context/UserContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userInfo } = useUserContext();

  if (userInfo?.email) {
    return <>{children}</>;
  } else {
    router.push("/auth");
  }
}

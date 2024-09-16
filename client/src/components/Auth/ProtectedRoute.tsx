"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userData } = useSelector((store: RootState) => store.user);

  if (userData?.email) {
    return <>{children}</>;
  } else {
    router.push("/auth/login");
  }
}

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Register from "../../components/Auth/Register";
import Login from "../../components/Auth/Login";
import { useUserContext } from "../../context/UserContext";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const { userInfo } = useUserContext();

  if (userInfo?.email) {
    router.push("/");
  }

  if (page === "register") {
    return <Register />;
  }

  return <Login />;
}

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Register from "../../../components/Auth/Register";
import Login from "../../../components/Auth/Login";
import { useUserContext } from "../../../context/UserContext";

export default function Auth(props: any) {
  const slug = props?.params?.slug;
  const router = useRouter();

  const { userInfo } = useUserContext();

  if (userInfo?.email) {
    router.push("/");
  }

  if (slug === "register") {
    return <Register />;
  } else if (slug === "login") {
    return <Login />;
  }
}

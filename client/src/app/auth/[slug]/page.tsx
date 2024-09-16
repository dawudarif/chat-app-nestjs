"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Register from "../../../components/Auth/Register";
import Login from "../../../components/Auth/Login";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function Auth(props: any) {
  const slug = props?.params?.slug;
  const router = useRouter();

  const { userData } = useSelector((store: RootState) => store.user);

  if (userData?.email) {
    router.push("/");
  }

  if (slug === "register") {
    return <Register />;
  } else if (slug === "login") {
    return <Login />;
  }
}

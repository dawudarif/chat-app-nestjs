"use client";
import React, { useEffect } from "react";
import api from "../../utils/api";
import { UserContextProvider, useUserContext } from "../../context/UserContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserContextProvider>
      <AuthProviderLayout>{children}</AuthProviderLayout>
    </UserContextProvider>
  );
}

const AuthProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const { setUserInfo } = useUserContext();

  const getProfile = async () => {
    const response = await api.get("/auth/profile");
    setUserInfo(response.data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <>{children}</>;
};

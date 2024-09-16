"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/features/userSlice";
import store from "../../redux/store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthProviderLayout>{children}</AuthProviderLayout>
    </Provider>
  );
}

const AuthProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<any>(fetchUserProfile());
  }, []);

  return <>{children}</>;
};

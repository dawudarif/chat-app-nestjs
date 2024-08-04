"use client";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import AppIcon from "../components/AppIcon";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const [loadingScreen, setLoaingScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaingScreen(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loadingScreen) {
    return (
      <div className="min-h-[30rem] h-[100vh] flex justify-center items-center transition-all duration-500">
        <AppIcon size={50} />
      </div>
    );
  }

  return <ProtectedRoute>hello</ProtectedRoute>;
}

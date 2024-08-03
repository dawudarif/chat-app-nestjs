import Image from "next/image";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <h1>hello</h1>
    </ProtectedRoute>
  );
}

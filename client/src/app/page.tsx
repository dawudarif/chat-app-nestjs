"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import ChatView from "../components/chat/ChatView/ChatView";
import ListView from "../components/chat/ListView/ListView";
import Ring from "../components/Loaders/Ring";
import { RootState } from "../redux/store";
import { socket } from "../utils/socket";

export default function Home() {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const { userData } = useSelector((store: RootState) => store.user);
  const { currentConversation } = useSelector(
    (store: RootState) => store.conversation
  );

  useEffect(() => {
    socket.disconnect();
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    if (userData?.userId) {
      console.log(`socket joined to ${userData.userId}`);
      socket.emit("join", userData.userId);
    }

    return () => {
      socket.disconnect();
    };
  }, [socket, userData?.userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loadingScreen) {
    return (
      <div className="min-h-[30rem] h-[100vh] flex justify-center items-center transition-all duration-500">
        <Ring size={50} color="#0082C8" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex max-w-full overflow-hidden">
        <ListView />
        <ChatView />
      </div>
    </ProtectedRoute>
  );
}

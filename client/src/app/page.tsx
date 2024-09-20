"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import ChatView from "../components/chat/ChatView/ChatView";
import ListView from "../components/chat/ListView/ListView";
import Ring from "../components/Loaders/Ring";
import { RootState } from "../redux/store";
import { socket } from "../utils/socket";
import { Message } from "../types/types";
import { setMessagesData } from "../redux/features/messagesSlice";

export default function Home() {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const { userData } = useSelector((store: RootState) => store.user);
  const { currentConversation: conversationId } = useSelector(
    (store: RootState) => store.conversation
  );
  const dispatch = useDispatch();

  const joinConversation = () => {
    socket.emit("joinConversation", { conversationId });

    socket.on("message", (data: Message) => {
      dispatch(setMessagesData(data));
    });
  };

  useEffect(() => {
    socket.disconnect();
    socket.connect();
    socket.on("connect", () => {
      // console.log("Connected to server");
    });
    if (userData?.userId) {
      // console.log(`socket joined to ${userData.userId}`);
      socket.emit("join", userData.userId);
    }

    return () => {
      socket.disconnect();
    };
  }, [socket, userData?.userId]);

  useEffect(() => {
    if (conversationId) {
      const handleConnect = () => {
        console.log("Socket connected, rejoining conversation...");
        joinConversation();
      };

      if (socket.connected) {
        handleConnect();
      } else {
        socket.on("connect", handleConnect);
      }

      socket.on("reconnect", () => {
        console.log("Successfully reconnected");
        handleConnect();
      });

      return () => {
        socket.off("message");
        socket.off("connect", handleConnect);
        socket.off("reconnect", handleConnect);
      };
    }
  }, [conversationId, socket]);

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

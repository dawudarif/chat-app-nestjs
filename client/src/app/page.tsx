"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import ChatView from "../components/chat/ChatView/ChatView";
import ListView from "../components/chat/ListView/ListView";
import Ring from "../components/Loaders/Ring";
import { addNewMessage } from "../redux/features/messagesSlice";
import { RootState } from "../redux/store";
import { Message } from "../types/types";
import { socket } from "../utils/socket";
import { updateConversations } from "../redux/features/conversationSlice";

export default function Home() {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const { userData } = useSelector((store: RootState) => store.user);
  const { currentConversation: conversationId } = useSelector(
    (store: RootState) => store.conversation
  );
  const dispatch = useDispatch();

  const handleIncomingMessage = (data: Message) => {
    dispatch(addNewMessage(data));
  };

  const joinConversation = () => {
    socket.emit("joinConversation", { conversationId });
  };

  const handleSocketConnect = () => {
    if (userData?.userId) {
      socket.emit("join", userData.userId);
      socket.on("updateConversation", (data) => {
        dispatch(updateConversations(data));
      });
    }
  };

  // socket connection
  useEffect(() => {
    socket.connect();
    socket.on("connect", handleSocketConnect);

    return () => {
      socket.disconnect();
    };
  }, [socket, userData?.userId]);

  // message and conversation handler
  useEffect(() => {
    if (conversationId) {
      const handleConnect = () => {
        console.log("Socket connected, rejoining conversation...");
        socket.on("message", handleIncomingMessage);
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
        socket.off("joinConversation");
        socket.emit("leaveConversation", { conversationId });
      };
    }
  }, [conversationId, socket]);

  // loading screen
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

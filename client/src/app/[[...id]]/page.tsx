"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";
import ChatView from "../../components/chat/ChatView/ChatView";
import ListView from "../../components/chat/ListView/ListView";
import Ring from "../../components/Loaders/Ring";
import { ConversationData } from "../../types/types";
import api from "../../utils/api";
import { socket } from "../../utils/socket";
import { useSelector } from "react-redux";
import store, { RootState } from "../../redux/store";

export default function Home(props: any) {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [conversationData, setConversationData] = useState<ConversationData[]>(
    []
  );
  const [conversationLoading, setConversationLoading] = useState(false);
  const { userData } = useSelector((store: RootState) => store.user);
  const pathnameConversationId = props?.params?.id && props?.params?.id[0];

  const getConversations = async () => {
    try {
      setConversationLoading(true);

      const response = await api.get("/conversation/all");
      setConversationData(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setConversationLoading(false);
    }
  };

  useEffect(() => {
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
    getConversations();
  }, []);

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
        <ListView
          conversationData={conversationData}
          conversationId={pathnameConversationId}
          loading={conversationLoading}
        />
        <ChatView
          conversationData={conversationData}
          conversationId={pathnameConversationId}
        />
      </div>
    </ProtectedRoute>
  );
}

"use client";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";
import AppIcon from "../../components/AppIcon";
import { Suspense, useEffect, useState } from "react";
import ListView from "../../components/chat/ListView";
import ChatView from "../../components/chat/ChatView";
import api from "../../utils/api";
import { ConversationData } from "../../types/types";
import Ring from "../../components/Loaders/Ring";

export default function Home(props: any) {
  const [loadingScreen, setLoaingScreen] = useState(true);
  const [conversationData, setConversationData] = useState<ConversationData[]>(
    []
  );

  const pathnameConversationId = props?.params?.id && props?.params?.id[0];

  const getConversations = async () => {
    try {
      const response = await api.get("/conversation/all");
      setConversationData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaingScreen(false);
    }, 1000);

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
        />
        <ChatView
          conversationData={conversationData}
          conversationId={pathnameConversationId}
        />
      </div>
    </ProtectedRoute>
  );
}

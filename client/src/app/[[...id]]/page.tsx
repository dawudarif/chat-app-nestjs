"use client";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";
import AppIcon from "../../components/AppIcon";
import { Suspense, useEffect, useState } from "react";
import ListView from "../../components/chat/ListView";
import ChatView from "../../components/chat/ChatView";
import api from "../../utils/api";
import { ConversationData } from "../../types/types";

export default function Home(props: any) {
  const [loadingScreen, setLoaingScreen] = useState(true);
  const [conversationData, setConversationData] = useState<ConversationData[]>(
    []
  );

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
        <AppIcon size={50} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex max-w-full overflow-hidden">
        <ListView
          conversationData={conversationData}
          conversationId={props.params.id[0]}
        />
        <ChatView
          conversationData={conversationData}
          conversationId={props.params.id[0]}
        />
      </div>
    </ProtectedRoute>
  );
}

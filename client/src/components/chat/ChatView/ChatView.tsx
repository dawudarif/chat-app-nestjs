"use client";
import { Info, Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import Input from "../../Custom/Input";
import { ConversationData, Message } from "../../../types/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ChatViewProps {
  conversationData?: ConversationData[];
  conversationId?: string;
}

const ChatView: React.FC<ChatViewProps> = ({
  conversationData,
  conversationId,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const searchQuery = useSearchParams();
  const validateParams = searchQuery.get("validate");
  const router = useRouter();

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/message`, {
        params: {
          count: messagesData.length,
          conversationId,
        },
      });
      setMessagesData([...messagesData, ...response.data]);
    } catch (error) {}
  };

  const findUser = conversationData?.find((item) => item.id === conversationId);

  if (!findUser) {
    return (
      <div className="min-h-[100vh] h-full w-full flex justify-center items-center">
        <div className="flex justify-center items-center text-base font-medium text-brand-black ">
          Select a Conversation
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] h-full w-full">
      <div className="flex justify-between items-center p-3 shadow-sm w-full">
        <div className="flex justify-center items-center gap-4">
          <div className="flex justify-center items-center rounded-full h-12 w-12 p-2 bg-brand-black text-white text-h4 uppercase">
            {findUser?.participants[0].user.name.slice(0, 2)}
          </div>
          <h1 className="text-h3 text-brand-black font-medium capitalize">
            {findUser?.participants[0].user.name}
          </h1>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Link href="/">
            <X size={30} />
          </Link>
          <Info size={30} />
        </div>
      </div>
      <div className="w-full h-[34.5rem] overflow-y-scroll">
        {messagesData.length > 0 &&
          messagesData.map((item) => {
            return <div>{item.body}</div>;
          })}
      </div>
      <div className="w-full flex justify-start items-center gap-2 mx-1 py-2">
        <Input
          type="text"
          handleChange={handleMessageInput}
          value={messageInput}
          placeholder="Enter Message"
          name="message"
          otherClasses="w-full max-w-[94%]"
        />
        <div className="hover:bg-brand-filled-blue hover:text-white text-brand-black transition-all duration-300 p-2 flex justify-center items-center rounded-md">
          <Send size={30} />
        </div>
      </div>
    </div>
  );
};

export default ChatView;

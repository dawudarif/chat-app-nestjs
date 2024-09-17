"use client";
import { Info, Send, X } from "lucide-react";
import React, { KeyboardEvent, useEffect, useState } from "react";
import api from "../../../utils/api";
import Input from "../../Custom/Input";
import { ConversationData, Message } from "../../../types/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { socket } from "../../../utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import clsx from "clsx";

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
  const { userData } = useSelector((store: RootState) => store.user);

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

      if (response.data) {
        setMessagesData([...messagesData, ...response.data]);
        joinConversation();
      }
    } catch (error) {}
  };

  const joinConversation = () => {
    socket.emit("joinConversation", { conversationId });

    socket.on("message", (data: Message) => {
      setMessagesData((prevMessages) => [data, ...prevMessages]);
    });
  };

  const sendMessage = async () => {
    if (messageInput.trim() === "") {
      return;
    }
    socket.emit("message", { message: messageInput, conversationId });
    if (conversationId && userData?.userId) {
      setMessagesData([
        {
          id: `id-${Math.random()}`,
          conversationId: conversationId,
          senderId: userData?.userId,
          body: messageInput,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
        ...messagesData,
      ]);
    }
    setMessageInput("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, []);

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
      <div className="flex justify-between items-center p-3 shadow-sm w-full h-full">
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
      <div className="w-full h-[80vh] overflow-y-scroll scrollbar-none px-5 flex flex-col-reverse gap-1">
        {messagesData.length > 0 &&
          messagesData.map((item) => {
            const matchUserId = item.senderId === userData?.userId;

            return (
              <div
                className={clsx(
                  matchUserId ? "justify-end" : "justify-start",
                  "flex"
                )}
              >
                <span
                  className={clsx(
                    matchUserId
                      ? "bg-brand-dark-gray/50"
                      : "bg-brand-filled-blue",
                    "px-2 py-2 rounded-2xl text-white text-lg"
                  )}
                >
                  {item.body}
                </span>
              </div>
            );
          })}
      </div>
      <div className="w-full flex justify-start items-center gap-2 mx-1 py-2">
        <Input
          type="text"
          handleChange={handleMessageInput}
          value={messageInput}
          onKeyPress={handleKeyPress}
          placeholder="Enter Message"
          name="message"
          otherClasses="w-full max-w-[94%]"
        />
        <div
          className="hover:bg-brand-filled-blue hover:text-white text-brand-black transition-all duration-300 p-2 flex justify-center items-center rounded-md"
          onClick={sendMessage}
        >
          <Send size={30} />
        </div>
      </div>
    </div>
  );
};

export default ChatView;

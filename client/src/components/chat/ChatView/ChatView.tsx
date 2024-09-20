"use client";
import { ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import React, { KeyboardEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Message } from "../../../types/types";
import api from "../../../utils/api";
import { socket } from "../../../utils/socket";
import Input from "../../Custom/Input";
import SingleMessage from "./SingleMessage";

const ChatView = () => {
  const [messageInput, setMessageInput] = useState("");
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const { userData } = useSelector((store: RootState) => store.user);
  const { currentConversation: conversationId, conversations } = useSelector(
    (store: RootState) => store.conversation
  );

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const fetchMessages = async () => {
    const initialMessages =
      messagesData.length && messagesData[0].conversationId === conversationId
        ? [...messagesData]
        : [];
    try {
      const response = await api.get(`/message`, {
        params: {
          count: initialMessages.length,
          conversationId,
        },
      });

      if (response.data) {
        setMessagesData([...initialMessages, ...response.data]);
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
          createdAt: `${new Date(Date.now())}`,
          updatedAt: `${new Date(Date.now())}`,
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
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      const handleConnect = () => {
        console.log("Socket connected, rejoining conversation...");
        joinConversation();
      };

      // If already connected, rejoin immediately, otherwise listen for connection
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
        socket.off("message"); // Remove the message listener
        socket.off("connect", handleConnect); // Clean up connect listener
        socket.off("reconnect", handleConnect); // Clean up reconnect listener
      };
    }
  }, [conversationId, socket]);

  const findUser = conversations?.find((item) => item.id === conversationId);

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
    <div className="min-h-[100vh] h-full w-[80%]">
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
          <Link
            href="/"
            className="rounded-md hover:bg-slate-100 p-2 flex justify-center items-center gap-2"
          >
            <ChevronLeft color="#272727" size={25} />
            <p className="text-base text-brand-black font-medium">Back</p>
          </Link>
        </div>
      </div>
      <div className="w-full h-[80vh] overflow-y-scroll scrollbar-none px-2 flex flex-col-reverse gap-1">
        {messagesData &&
          messagesData.length > 0 &&
          messagesData.map((item, index) => {
            const matchUserId = item.senderId === userData?.userId;

            return (
              <SingleMessage
                key={index}
                index={index}
                length={messagesData.length}
                message={item}
                messages={messagesData}
                sentByMe={matchUserId}
              />
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

"use client";
import clsx from "clsx";
import { ChevronLeft, Send } from "lucide-react";
import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConversation,
  updateConversations,
} from "../../../redux/features/conversationSlice";
import {
  addNewMessage,
  clearMessages,
  setMessagesData,
} from "../../../redux/features/messagesSlice";
import { RootState } from "../../../redux/store";
import { ConversationData } from "../../../types/types";
import api from "../../../utils/api";
import { socket } from "../../../utils/socket";
import Input from "../../Custom/Input";
import Ring from "../../Loaders/Ring";
import SingleMessage from "./SingleMessage";

const ChatView = () => {
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [oldMessagesLoading, setOldMessagesLoading] = useState(false);
  const [fetchNew, setFetchNew] = useState(true);
  const { userData } = useSelector((store: RootState) => store.user);
  const { currentConversation: conversationId, conversations } = useSelector(
    (store: RootState) => store.conversation
  );
  const { messagesData } = useSelector((store: RootState) => store.message);
  const dispatch = useDispatch();

  const observer = useRef<IntersectionObserver | null>(null);

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const fetchMessages = async () => {
    const initialMessages =
      messagesData.length && messagesData[0].conversationId === conversationId
        ? [...messagesData]
        : [];
    try {
      initialMessages.length > 0
        ? setOldMessagesLoading(true)
        : setLoading(true);

      const response = await api.get(`/message`, {
        params: {
          count: initialMessages.length,
          conversationId,
        },
      });

      if (response.data) {
        dispatch(setMessagesData([...initialMessages, ...response.data]));
        if (response.data.length === 0) setFetchNew(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setOldMessagesLoading(false);
    }
  };

  const handleNewMessageUpdate = () => {
    if (conversationId && userData?.userId) {
      const message = {
        id: `id-${Math.random()}`,
        conversationId: conversationId,
        senderId: userData?.userId,
        body: messageInput,
        createdAt: `${new Date(Date.now())}`,
        updatedAt: `${new Date(Date.now())}`,
      };
      dispatch(addNewMessage(message));

      const getConversation = conversations.find(
        (c: ConversationData) => c.id === conversationId
      );

      if (getConversation) {
        const conversation = {
          ...getConversation,
          latestMessageId: message.id,
          latestMessage: {
            body: message.body,
            senderId: message.senderId,
          },
        };
        dispatch(updateConversations(conversation));
      }
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() === "") {
      return;
    }
    socket.emit("message", { message: messageInput, conversationId });
    handleNewMessageUpdate();
    setMessageInput("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!fetchNew && !observer?.current) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && fetchNew) {
          fetchMessages();
        }
      });

      if (node) observer.current.observe(node);
    },
    [messagesData, fetchNew]
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(clearMessages());
      fetchMessages();
    }
  }, [conversationId]);

  const findUser = conversations?.find((item) => item.id === conversationId);

  if (!findUser) {
    return (
      <div
        className={clsx(
          conversationId ? "flex" : "hidden",
          "min-h-[100vh] h-full w-full md:!flex justify-center items-center"
        )}
      >
        <div className="flex justify-center items-center text-base font-medium text-brand-black ">
          Select a Conversation
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        conversationId ? "block" : "hidden",
        "min-h-[100vh] h-full w-full md:!block"
      )}
    >
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
          <div
            onClick={() => dispatch(setCurrentConversation(null))}
            className="rounded-md hover:bg-slate-100 p-2 flex justify-center items-center gap-2 cursor-pointer"
          >
            <ChevronLeft color="#272727" size={25} />
            <p className="text-base text-brand-black font-medium md:inline-block hidden">
              Back
            </p>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          loading && "bg-slate-50 animate-pulse",
          "w-full h-[80vh] overflow-y-scroll scrollbar-none px-2 flex flex-col-reverse gap-1"
        )}
      >
        {messagesData &&
          messagesData.length > 0 &&
          messagesData.map((item, index) => {
            const matchUserId = item.senderId === userData?.userId;

            return (
              <div
                key={index}
                ref={index === messagesData.length - 1 ? lastElementRef : null}
              >
                <SingleMessage
                  index={index}
                  length={messagesData.length}
                  message={item}
                  messages={messagesData}
                  sentByMe={matchUserId}
                />
              </div>
            );
          })}
        {oldMessagesLoading && (
          <div className="py-4 flex justify-center items-center">
            <Ring size={25} />
          </div>
        )}
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

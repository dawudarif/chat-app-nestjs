import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";
import { ConversationData } from "../../types/types";
import Input from "../Custom/Input";
import { useUserContext } from "../../context/UserContext";

interface ListViewProps {
  conversationData?: ConversationData[];
  conversationId?: string;
  loading: boolean;
}

const ListView: React.FC<ListViewProps> = ({
  conversationData,
  conversationId,
  loading,
}) => {
  const [search, setSearch] = useState("");
  const { userInfo } = useUserContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col justify-start items-center w-1/4 p-2 border-r border-brand-black h-[100vh]">
      {loading}
      <Input
        handleChange={handleInputChange}
        value={search}
        inputType="search"
        name="input"
        placeholder="Search"
        otherClasses="w-full border-l-0 border-t-0 border-r-0 rounded-none"
        type="text"
      />

      {loading
        ? Array(10)
            .fill(null)
            .map((_, i) => {
              return (
                <div
                  key={i}
                  className="w-full border-b border-brand-dark-gray p-1 group"
                >
                  <div className="animate-pulse duration-100 p-2 my-[.15rem] cursor-pointer bg-brand-black/40 rounded-lg">
                    <h1 className="bg-brand-black/50 rounded-md w-[70%] h-6"></h1>
                    <h6 className="bg-brand-black/50 rounded-md w-1/2 h-5 mt-1"></h6>
                  </div>
                </div>
              );
            })
        : conversationData &&
          conversationData?.length > 0 &&
          conversationData.map((item: ConversationData) => {
            const latestMessageName =
              item.latestMessage?.senderId === userInfo?.userId
                ? "You"
                : "@" + item.participants[0].user.username?.toLowerCase();
            return (
              <Link
                href={`/${item.id}`}
                key={item.id}
                className="w-full border-b border-brand-dark-gray p-1 group"
              >
                <div
                  className={clsx(
                    item.id === conversationId &&
                      "bg-brand-filled-blue text-white rounded-lg",
                    "group-hover:bg-brand-filled-blue/90 group-hover:text-white text-brand-black group-hover:rounded-lg transition-all duration-100 p-2 my-[.15rem] cursor-pointer"
                  )}
                >
                  <h1 className="font-medium text-base capitalize">
                    {item.participants[0].user.name}
                  </h1>

                  {item.latestMessage?.body ? (
                    <h6 className="text-sm italic">
                      {latestMessageName}
                      {": "} {item.latestMessage?.body}
                    </h6>
                  ) : (
                    <h6 className="text-sm font-normal">
                      {item.participants[0].user.username}
                    </h6>
                  )}
                </div>
              </Link>
            );
          })}
    </div>
  );
};

export default ListView;

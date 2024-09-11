import React, { useState } from "react";
import Input from "../Custom/Input";
import { ConversationData } from "../../types/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface ListViewProps {
  conversationData?: ConversationData[];
  conversationId?: string;
}

const ListView: React.FC<ListViewProps> = ({
  conversationData,
  conversationId,
}) => {
  const [search, setSearch] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col justify-start items-center w-1/4 p-2 border-r border-brand-black h-[100vh]">
      <Input
        handleChange={handleInputChange}
        value={search}
        inputType="search"
        name="input"
        placeholder="Search"
        otherClasses="w-full border-l-0 border-t-0 border-r-0 rounded-none"
        type="text"
      />
      {conversationData &&
        conversationData.map((item: ConversationData) => {
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
                <h6 className="text-sm italic">
                  @{item.participants[0].user.username}
                </h6>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default ListView;

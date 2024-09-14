import React from "react";
import { ConversationData } from "../../../types/types";
import Link from "next/link";
import clsx from "clsx";

interface SingleConversationItemProps {
  item: ConversationData;
  conversationId: string | undefined;
  latestMessageName: string | undefined;
}

const SingleConversationItem: React.FC<SingleConversationItemProps> = ({
  item,
  conversationId,
  latestMessageName,
}) => {
  return (
    <Link
      href={`/${item.id}`}
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
            @{item.participants[0].user.username}
          </h6>
        )}
      </div>
    </Link>
  );
};
export default SingleConversationItem;

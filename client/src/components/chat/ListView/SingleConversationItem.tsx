import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentConversation } from "../../../redux/features/conversationSlice";
import { ConversationData } from "../../../types/types";

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
  const dispatch = useDispatch();

  const handleConversationChange = () => {
    dispatch(setCurrentConversation(item.id));
  };

  return (
    <div
      onClick={handleConversationChange}
      className="w-full border-b border-brand-dark-gray p-1 group"
    >
      <div
        className={clsx(
          item.id === conversationId && "bg-brand-filled-blue text-white",
          "group-hover:bg-brand-filled-blue/90 group-hover:text-white text-brand-black rounded-lg transition-all duration-100 p-2 my-[.15rem] cursor-pointer box-border"
        )}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-base capitalize">
            {item.participants[0].user.name}
          </h1>

          <span className="h-2 w-2 group-hover:bg-transparent bg-brand-filled-blue rounded-full"></span>
        </div>

        {item.latestMessage?.body ? (
          <h6 className="text-sm italic line-clamp-2">
            {latestMessageName}
            {": "} {item.latestMessage?.body}
          </h6>
        ) : (
          <h6 className="text-sm font-normal line-clamp-1">
            @{item.participants[0].user.username}
          </h6>
        )}
      </div>
    </div>
  );
};
export default SingleConversationItem;

import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  setCurrentConversation,
} from "../../../redux/features/conversationSlice";
import { ConversationData } from "../../../types/types";
import { RootState } from "../../../redux/store";
import { socket } from "../../../utils/socket";

interface SingleConversationItemProps {
  item: ConversationData;
  conversationId: string | undefined;
}

const SingleConversationItem: React.FC<SingleConversationItemProps> = ({
  item,
  conversationId,
}) => {
  const { userData } = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();

  const handleConversationChange = () => {
    dispatch(setCurrentConversation(item.id));
  };

  const otherParticipant = item.participants.find(
    (p) => p.userId !== userData?.userId
  );
  const currentUserParticipant = item.participants.find(
    (p) => p.userId === userData?.userId
  );

  const latestMessageName =
    item?.latestMessage?.senderId === userData?.userId
      ? "You"
      : "@" + otherParticipant?.user?.username?.toLowerCase();

  useEffect(() => {
    if (
      !currentUserParticipant?.hasSeenLatestMessage &&
      conversationId === item.id &&
      userData?.userId
    ) {
      socket.emit("markRead", { conversationId });
      dispatch(markAsRead({ conversationId, userId: userData?.userId }));
    }
  }, [item, conversationId]);

  if (!otherParticipant) return;

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
            {otherParticipant.user.name}
          </h1>

          {!currentUserParticipant?.hasSeenLatestMessage && (
            <span className="h-2 w-2 group-hover:bg-transparent bg-brand-filled-blue rounded-full"></span>
          )}
        </div>

        {item.latestMessage?.body ? (
          <h6 className="text-sm italic line-clamp-2">
            {latestMessageName}
            {": "} {item.latestMessage?.body}
          </h6>
        ) : (
          <h6 className="text-sm font-normal line-clamp-1">
            @{otherParticipant.user.username}
          </h6>
        )}
      </div>
    </div>
  );
};
export default SingleConversationItem;

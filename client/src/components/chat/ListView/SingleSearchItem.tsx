import React, { useState } from "react";
import Ring from "../../Loaders/Ring";
import clsx from "clsx";
import api from "../../../utils/api";
import { useRouter } from "next/navigation";
import { SearchData } from "../../../types/types";

interface SingleSearchItemProps {
  item: SearchData;
}

const SingleSearchItem: React.FC<SingleSearchItemProps> = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createConversation = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await api.post("/conversation/create", { id: item.id });

      if (response.data) {
        router.push(`/${response.data.conversation.id}`);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full border-b border-brand-dark-gray p-1 group"
      onClick={createConversation}
    >
      <div
        className={clsx(
          !loading &&
            "group-hover:bg-brand-filled-blue/90 group-hover:text-white",
          "text-brand-black group-hover:rounded-lg transition-all duration-100 p-2 my-[.15rem] cursor-pointer flex justify-between items-center"
        )}
      >
        <div>
          <h1 className="font-medium text-base capitalize">{item.username}</h1>

          <h6 className="text-sm font-normal">@{item.username}</h6>
        </div>

        {loading && <Ring size={20} color="#333" />}
      </div>
    </div>
  );
};
export default SingleSearchItem;

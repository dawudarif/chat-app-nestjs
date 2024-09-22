import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConversationData, SearchData } from "../../../types/types";
import api from "../../../utils/api";
import Input from "../../Custom/Input";
import SingleConversationItem from "./SingleConversationItem";
import SingleSearchItem from "./SingleSearchItem";
import { RootState } from "../../../redux/store";
import { setConversations } from "../../../redux/features/conversationSlice";

const ListView = () => {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentConversation, conversations } = useSelector(
    (store: RootState) => store.conversation
  );
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchConversations = async () => {
    try {
      const response = await api.post("/conversation/search", { text: search });

      if (response.status === 201) {
        setSearchData(response.data);
      }
    } catch (error) {
    } finally {
      setSearchLoading(false);
    }
  };

  const getConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/conversation/all");
      dispatch(setConversations(response.data));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (search === "") {
      setSearchData([]);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(() => searchConversations(), 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex flex-col justify-start items-center !w-[25rem] p-2 border-r border-brand-black h-[100vh] box-border">
      <Input
        handleChange={handleInputChange}
        value={search}
        inputType="search"
        name="input"
        placeholder="Search"
        otherClasses="w-full border-l-0 border-t-0 border-r-0 rounded-none"
        type="text"
        iconColor={search !== "" ? "#0082C8" : undefined}
      />

      {loading || searchLoading
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
        : search !== ""
        ? searchData &&
          searchData?.length > 0 &&
          searchData.map((item: SearchData) => {
            return <SingleSearchItem key={item.id} item={item} />;
          })
        : sortedConversations &&
          sortedConversations?.length > 0 &&
          sortedConversations.map((item: ConversationData) => {
            return (
              <SingleConversationItem
                key={item.id}
                item={item}
                conversationId={currentConversation}
              />
            );
          })}
    </div>
  );
};

export default ListView;

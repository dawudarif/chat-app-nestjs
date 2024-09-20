import { createSlice } from "@reduxjs/toolkit";
import { ConversationData } from "../../types/types";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currentConversation: undefined as undefined | string,
    conversations: [] as ConversationData[],
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
});

export const { setCurrentConversation, setConversations } =
  conversationSlice.actions;
export default conversationSlice.reducer;

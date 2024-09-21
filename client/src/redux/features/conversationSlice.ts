import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    updateConversations: (state, action: PayloadAction<ConversationData>) => {
      let initialConversations = [...state.conversations];

      const checkExisting = initialConversations.find(
        (c) => c.id === action.payload.id
      );
      if (checkExisting) {
        state.conversations = initialConversations.map((c) => {
          if (c.id === action.payload.id) {
            return action.payload;
          }
          return c;
        });
      } else {
        state.conversations = [...initialConversations, action.payload];
      }
    },
  },
});

export const { setCurrentConversation, setConversations, updateConversations } =
  conversationSlice.actions;
export default conversationSlice.reducer;

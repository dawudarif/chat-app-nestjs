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
    markAsRead: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      let initialConversations = [...state.conversations];

      const markRead = initialConversations.map((c) => {
        if (c.id === action.payload.conversationId) {
          c.participants.forEach((p) => {
            if (p.userId === action.payload.userId) {
              return (p.hasSeenLatestMessage = true);
            }
            return p;
          });
        }

        return c;
      });

      state.conversations = markRead;
    },
  },
});

export const {
  setCurrentConversation,
  setConversations,
  updateConversations,
  markAsRead,
} = conversationSlice.actions;
export default conversationSlice.reducer;

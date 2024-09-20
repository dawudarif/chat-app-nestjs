import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types/types";

const messagesSlice = createSlice({
  name: "message",
  initialState: {
    currentConversation: undefined as undefined | string,
    messagesData: [] as Message[],
  },
  reducers: {
    setMessagesData: (state, action) => {
      state.messagesData = action.payload;
    },
    addMessagesData: (state, action) => {
      state.messagesData = [...state.messagesData, ...action.payload];
    },
  },
});

export const { setMessagesData } = messagesSlice.actions;
export default messagesSlice.reducer;

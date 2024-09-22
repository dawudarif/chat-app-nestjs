import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../types/types";

const messagesSlice = createSlice({
  name: "message",
  initialState: {
    messagesData: [] as Message[],
  },
  reducers: {
    setMessagesData: (state, action) => {
      state.messagesData = action.payload;
    },
    addNewMessage: (state, action) => {
      const messages = [action.payload, ...state.messagesData];
      state.messagesData = messages;
    },
    clearMessages: (state) => {
      state.messagesData = [];
    },
  },
});

export const { setMessagesData, addNewMessage, clearMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;

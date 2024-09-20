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
  },
});

export const { setMessagesData, addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;

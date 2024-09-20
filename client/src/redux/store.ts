import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import conversationReducer from "./features/conversationSlice";
import messagesReducer from "./features/messagesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message: messagesReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;

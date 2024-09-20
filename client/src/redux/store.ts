import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import conversationReducer from "./features/conversationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;

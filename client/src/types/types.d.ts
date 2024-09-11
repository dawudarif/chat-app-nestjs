import { ChangeEvent } from "react";

export interface InputChangeProps {
  e: ChangeEvent<HTMLInputElement>;
  name: string;
}

export interface ConversationData {
  id: string;
  latestMessageId: string;
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
}

export interface Participant {
  id: string;
  userId: string;
  conversationId: string;
  hasSeenLatestMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface User {
  username: string;
  id: string;
  email: string;
  name: string;
}

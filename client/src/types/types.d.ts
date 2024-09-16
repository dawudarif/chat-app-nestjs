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
  latestMessage?: LatestMessage;
  participants: Participant[];
}

export interface LatestMessage {
  senderId: string;
  body: string;
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchData {
  id: string;
  username: string;
  name: string;
}

export interface UserProfileData {
  userId: string;
  name: string;
  email: string;
}

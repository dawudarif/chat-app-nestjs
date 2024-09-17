import { io } from "socket.io-client";

const URL = "http://localhost:4000/";

export const socket = io(URL, {
  autoConnect: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  withCredentials: true,
  transports: ["websocket"],
});

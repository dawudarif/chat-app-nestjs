"use client";
import React, { ChangeEvent, useState } from "react";
import Input from "../Custom/Input";
import { Cross, CrossIcon, Delete, Info, Send, X } from "lucide-react";

export default function ChatView() {
  const [messageInput, setMessageInput] = useState("");

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  return (
    <div className="min-h-[100vh] h-full w-full">
      <div className="flex justify-between items-center p-3 shadow-sm w-full">
        <div className="flex justify-center items-center gap-4">
          <div className="flex justify-center items-center rounded-full h-12 w-12 p-2 bg-brand-black text-white text-h4">
            DA
          </div>
          <h1 className="text-h3 text-brand-black font-medium">Dawood Arif</h1>
        </div>

        <div className="flex justify-center items-center gap-2">
          <X size={30} />
          <Info size={30} />
        </div>
      </div>
      <div className="w-full h-[34.5rem] overflow-y-scroll"></div>

      <div className="w-full flex justify-start items-center gap-2 mx-1 py-2">
        <Input
          type="text"
          handleChange={handleMessageInput}
          value={messageInput}
          placeholder="Enter Message"
          name="message"
          otherClasses="w-full max-w-[94%]"
        />
        <div className="hover:bg-brand-filled-blue hover:text-white text-brand-black transition-all duration-300 p-2 flex justify-center items-center rounded-md">
          <Send size={30} />
        </div>
      </div>
    </div>
  );
}

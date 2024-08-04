import { MessageCircle } from "lucide-react";
import React from "react";

export default function AppIcon({
  size,
  otherClasses,
}: {
  size: number;
  otherClasses?: string;
}) {
  return (
    <div className="flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center">
        <div className="p-4 rounded-2xl bg-brand-black w-fit">
          <MessageCircle size={size} color="white" className={otherClasses} />
        </div>
        <h1 className="text-h1 font-medium text-brand-black font-sans">
          Chat App
        </h1>
      </div>
    </div>
  );
}

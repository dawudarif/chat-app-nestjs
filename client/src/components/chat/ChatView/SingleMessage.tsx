import moment from "moment";
import React from "react";
import { Message } from "../../../types/types";
import clsx from "clsx";

interface SingleMessageProps {
  message: Message;
  messages: Array<Message>;
  sentByMe: boolean;
  index: number;
  length: number;
}

const SingleMessage: React.FC<SingleMessageProps> = ({
  message,
  sentByMe,
  index,
  length,
  messages,
}) => {
  const getDateFormat = (date: string) => {
    return moment(date).format("DD/MM/YY");
  };

  const first = index === length - 1;

  const display =
    index !== length - 1 &&
    getDateFormat(messages[index + 1].createdAt) !==
      getDateFormat(message.createdAt);

  return (
    <div>
      {(first || display) && (
        <div className="py-6 flex justify-center items-center">
          <p className="text-md p-1 text-black rounded-md text-center font-semibold font-sans w-fit">
            {getDateFormat(message.createdAt)}
          </p>
        </div>
      )}

      <div
        className={`box-border flex w-[100%] break-words py-2 ${
          sentByMe ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={clsx(
            sentByMe ? "bg-brand-dark-gray/50" : "bg-brand-filled-blue",
            "max-h-max min-w-[5rem] max-w-[50%] flex-col rounded-2xl text-base text-white p-2"
          )}
        >
          <p className="text-white">{message.body}</p>
          <p className="text-right font-mono text-xs">
            {moment(message.createdAt).format("hh:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
};
export default SingleMessage;

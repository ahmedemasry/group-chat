import { Message } from "@chat/types";
import { Strings } from "@chat/util/strings";
import { User } from "firebase/auth";
import React from "react";

interface MessageItemProps {
  message: Message;
  currentUser?: User | null;
  messageUser?: User | null;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  messageUser,
}) => {
  return (
    <div
      key={message.id}
      className={`message py-2 px-4 my-2 rounded-3xl ${
        message.sender === currentUser?.uid
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-300 text-black mr-auto"
      }`}
      style={{
        maxWidth: window.innerWidth < 640 ? "80%" : "60%",
        borderTopRightRadius:
          message.sender === currentUser?.uid ? 0 : undefined,
        borderTopLeftRadius:
          message.sender !== currentUser?.uid ? 0 : undefined,
      }}
    >
      <div className="flex items-stretch space-x-2 w-full">
        <p className="font-bold">
          {messageUser?.displayName ??
            messageUser?.email ??
            messageUser?.phoneNumber ??
            Strings.UNKNOWN_USER}
        </p>
        <p
          className={`text-sm ${
            message.sender === currentUser?.uid
              ? "text-gray-300"
              : "text-gray-500"
          } text-right`}
        >
          {message.createdAt
            ? new Date(message.createdAt.seconds * 1000).toLocaleString()
            : Strings.UNKNOWN_TIME}
        </p>
      </div>
      <p
        className={`${
          message.sender === currentUser?.uid ? "text-white" : "text-black"
        }`}
      >
        {message.message}
      </p>
    </div>
  );
};

export default MessageItem;

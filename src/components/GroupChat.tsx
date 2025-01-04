"use client";

import useFetchUserDetails from "@chat/hooks/useFetchUsersDetails";
import useMessages from "@chat/hooks/useMessages";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";

export default function GroupChat() {
  const {
    handleMessageSubmit,
    loadingMessages,
    messages,
    newMessage,
    setNewMessage,
    chatContainerRef,
    currentUser,
  } = useMessages();

  const { loadingUsers, users } = useFetchUserDetails();

  const loading = loadingMessages || loadingUsers;

  return (
    <div className="bg-gray-100 p-4 rounded shadow max-h-[80vh] flex flex-col">
      <div
        ref={chatContainerRef}
        className="chat-container bg-gray-100 p-4 rounded shadow max-h-[80vh] overflow-y-auto flex flex-col"
      >
        <h2 className="text-lg font-bold mb-4">Group Chat</h2>

        <div className="messages flex-grow">
          {messages.map((message) => {
            const messageUser = users.find(
              (user) => user.uid === message.sender
            );
            const key = message.id;
            return (
              <MessageItem
                message={message}
                currentUser={currentUser}
                messageUser={messageUser}
                key={key}
              ></MessageItem>
            );
          })}
        </div>
      </div>

      <MessageInput
        handleMessageSubmit={handleMessageSubmit}
        loading={loading}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      ></MessageInput>
    </div>
  );
}

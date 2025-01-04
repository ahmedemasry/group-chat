"use client";

import useFetchUserDetails from "@chat/hooks/useFetchUsersDetails";
import useMessages from "@chat/hooks/useMessages";
import MessageInput from "./MessageInput";

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

        {/* Message Display */}
        <div className="messages flex-grow">
          {messages.map((message) => {
            const messageUser = users.find(
              (user) => user.uid === message.sender
            );
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
                      "Unknown User"}
                  </p>
                  <p
                    className={`text-sm ${
                      message.sender === currentUser?.uid
                        ? "text-gray-300"
                        : "text-gray-500"
                    } text-right`}
                  >
                    {message.createdAt
                      ? new Date(
                          message.createdAt.seconds * 1000
                        ).toLocaleString()
                      : "Unknown Time"}
                  </p>
                </div>
                <p
                  className={`${
                    message.sender === currentUser?.uid
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {message.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input Form */}
      <MessageInput
        handleMessageSubmit={handleMessageSubmit}
        loading={loading}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      ></MessageInput>
    </div>
  );
}

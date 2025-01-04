import React from "react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleMessageSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleMessageSubmit,
  loading,
}) => {
  return (
    <form onSubmit={handleMessageSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Type your message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading || !newMessage.trim()}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;

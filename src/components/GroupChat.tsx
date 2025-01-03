"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "@chat/services/firebase";
import { getAuth } from "firebase/auth";

interface Message {
  id: string;
  message: string;
  sender: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
}

export default function GroupChat() {
  const db = useMemo(() => getFirestore(firebaseApp), []);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Create a ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages and listen to real-time updates
  useEffect(() => {
    const messagesQuery = query(
      collection(db, "groupChat"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [db]);

  // Fetch user details from Firestore for each sender
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          uid: doc.id,
          displayName: doc.data().displayName,
          email: doc.data().email,
        })) as User[];
        setUsers(userList);
      } catch (err: any) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // Handle message submission
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    setLoading(true);

    try {
      // Add a new message to Firestore
      await addDoc(collection(db, "groupChat"), {
        message: newMessage,
        sender: currentUser.uid,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom whenever the messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-gray-100 p-4 rounded shadow max-h-[80vh] flex flex-col">
      <div
        ref={chatContainerRef}
        className="chat-container bg-gray-100 p-4 rounded shadow max-h-[80vh] overflow-y-auto flex flex-col"
      >
        <h2 className="text-lg font-bold mb-4">Group Chat</h2>

        {/* Message Display */}
        <div className="messages flex-grow">
          {messages.map((message) => (
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
                  {users.find((user) => user.uid === message.sender)
                    ?.displayName || "Unknown User"}
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
          ))}
        </div>
      </div>

      {/* Message Input Form */}
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
    </div>
  );
}

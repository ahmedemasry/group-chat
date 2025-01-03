"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  Timestamp,
  getDoc,
  doc,
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
}

export default function GroupChat() {
  const db = useMemo(() => getFirestore(firebaseApp), []);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  console.log("messages:", messages);

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
    const fetchUserDetails = async (uid: string) => {
      const userDoc = doc(db, "users", uid); // Assuming you have a "users" collection
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUsers((prevUsers) => ({
          ...prevUsers,
          [uid]: userData?.displayName || "Unknown User",
        }));
      }
    };

    // Fetch names for all senders
    messages.forEach((message) => {
      if (message.sender && !users[message.sender]) {
        fetchUserDetails(message.sender);
      }
    });
  }, [messages, db, users]);

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
        createdAt: Timestamp.fromDate(new Date()), // Save current timestamp
      });
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error adding message: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container bg-gray-100 p-4 rounded shadow max-h-96 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Group Chat</h2>

      {/* Message Display */}
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message py-2 border-b">
            <p className="font-bold">
              {message.sender === currentUser?.uid
                ? "You"
                : users[message.sender] || "Unknown User"}
            </p>
            <p className="text-gray-700">{message.message}</p>
            <p className="text-sm text-gray-500">
              {message.createdAt
                ? new Date(message.createdAt.seconds * 1000).toLocaleString()
                : "Unknown Time"}
            </p>
          </div>
        ))}
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

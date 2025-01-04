import { useEffect, useMemo, useState, useRef } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import firebaseApp from "@chat/services/firebase";
import { getAuth, User } from "firebase/auth";
import { Message } from "@chat/types";

const useMessages = () => {
  const db = useMemo(() => getFirestore(firebaseApp), []);
  const auth = getAuth();
  const currentUser = auth.currentUser;

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

  return {
    messages,
    newMessage,
    setNewMessage,
    handleMessageSubmit,
    loadingMessages: loading,
    chatContainerRef,
    currentUser,
  };
};

export default useMessages;

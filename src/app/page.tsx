"use client";

import firebaseApp from "@chat/services/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import GroupChat from "@chat/components/GroupChat";

export default function Home() {
  const [user, loading, error] = useAuthState(getAuth(firebaseApp));
  const router = useRouter();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Error: {error.message}</p>
      </main>
    );
  }

  if (user) {
    // Group Chat Page Layout for logged-in users
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-6">
        <header className="w-full flex items-center justify-between p-4 bg-gray-800 text-white">
          <h1 className="text-xl">Group Chat</h1>
          <button
            onClick={() => getAuth(firebaseApp).signOut()}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </header>
        <section className="w-full max-w-4xl flex flex-col gap-4 p-4">
          <h2 className="text-lg font-bold">
            Welcome, {user.displayName || user.email}
          </h2>
          <GroupChat />
        </section>
      </main>
    );
  }

  // Landing Page Layout for logged-out users
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => router.push("/auth")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </div>
    </main>
  );
}

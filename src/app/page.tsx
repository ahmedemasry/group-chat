"use client";

import firebaseApp from "@chat/services/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

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
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-gray-700">This is your group chat area!</p>
          </div>
        </section>
      </main>
    );
  }

  // Landing Page Layout for logged-out users
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Logged Out
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => router.push("/auth")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </div>

      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="/auth"
          target="_blank"
          rel="noopener noreferrer"
        >
          By <span className="text-blue-500">Your Company</span>
        </a>
      </div>
    </main>
  );
}

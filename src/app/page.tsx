"use client";

import { UserProvider, useUser } from "@chat/context/UserContext";
import { useRouter } from "next/navigation";
import GroupChat from "@chat/components/GroupChat";
import useCreateUserDocument from "@chat/hooks/useCreateUserDocument";

function HomePageContent() {
  const { user, loading, error, logout } = useUser();
  const router = useRouter();

  useCreateUserDocument(user);

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
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-6">
        <header className="w-full flex items-center justify-between p-4 bg-gray-800 text-white">
          <h1 className="text-xl">Group Chat</h1>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        </header>
        <section className="w-full max-w-4xl flex flex-col gap-4 p-4 flex-grow">
          <h2 className="text-lg font-bold">
            Welcome, {user.displayName || user.email}
          </h2>
          <GroupChat />
        </section>
      </main>
    );
  }

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

export default function HomePage() {
  return (
    <UserProvider>
      <HomePageContent />
    </UserProvider>
  );
}

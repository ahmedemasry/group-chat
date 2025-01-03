"use client";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import firebaseApp from "@chat/services/firebase";

export default function AuthPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter(); // Next.js router for navigation

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password);
      router.push("/"); // Redirect to home page after sign-in
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
      router.push("/"); // Redirect to home page after sign-up
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseApp.auth().sendPasswordResetEmail(email);
      setResetEmailSent(true); // Show success message after sending reset email
    } catch (err: any) {
      setError("Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h1 className="text-xl font-bold mb-4">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {resetEmailSent && (
          <p className="text-green-500 mb-4">
            Password reset email sent! Check your inbox.
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded mb-2"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        {error && (
          <div className="flex justify-between items-center">
            <button
              onClick={handlePasswordReset}
              className="text-blue-500 text-sm"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

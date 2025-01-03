"use client";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import firebaseApp from "@chat/services/firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";

export default function AuthPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // State to store display name for sign-up
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up
  const router = useRouter(); // Next.js router for navigation

  const db = getFirestore(firebaseApp); // Firestore instance

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
      const userCredential = await firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store the user's display name in Firestore
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          displayName: displayName || "Anonymous", // Use the provided display name or default to "Anonymous"
          email: user.email,
          createdAt: new Date(),
        });

        // Optionally, update the Firebase user profile display name
        await user.updateProfile({
          displayName: displayName || "Anonymous",
        });
      }

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
        {/* Tab View */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 py-2 text-center ${
              !isSignUp ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 py-2 text-center ${
              isSignUp ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-xl font-bold mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>

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

        {isSignUp && (
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
        )}

        <button
          onClick={isSignUp ? handleSignUp : handleSignIn}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded mb-2"
        >
          {loading
            ? isSignUp
              ? "Creating Account..."
              : "Signing In..."
            : isSignUp
            ? "Sign Up"
            : "Sign In"}
        </button>

        {isSignUp ? (
          <div className="flex justify-between items-center">
            <button
              onClick={handlePasswordReset}
              className="text-blue-500 text-sm"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

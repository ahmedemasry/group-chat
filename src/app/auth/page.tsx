"use client";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import firebaseApp from "@chat/services/firebase";

export default function AuthPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // State to store display name for sign-up
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up
  const [isPhoneAuth, setIsPhoneAuth] = useState(false); // State to toggle between Phone Auth and Email Auth
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const [verificationCode, setVerificationCode] = useState(""); // State for verification code
  const [confirmResult, setConfirmResult] =
    useState<firebase.auth.ConfirmationResult | null>(null); // Store confirmation result for phone auth
  const router = useRouter(); // Next.js router for navigation

  // Email Sign-In
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

  // Email Sign-Up
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    // Validate fields before proceeding
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (!displayName && isSignUp) {
      setError("Display Name is required for sign up.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Optionally, update the Firebase user profile display name
      if (user) {
        await user.updateProfile({
          displayName: displayName,
        });
      }

      router.push("/"); // Redirect to home page after sign-up
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone Authentication
  const handlePhoneSignIn = async () => {
    setLoading(true);
    setError(null);
    const recaptchaVerifier: firebase.auth.RecaptchaVerifier =
      new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: (response: any) => console.log(response),
      });

    try {
      const confirmation = await firebaseApp
        .auth()
        .signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      setConfirmResult(confirmation); // Store the confirmation result
    } catch (err: any) {
      setError("Phone authentication failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the phone number using the entered verification code
  const handleVerifyCode = async () => {
    if (!confirmResult || !verificationCode) return;

    setLoading(true);
    setError(null);

    try {
      await confirmResult.confirm(verificationCode);
      router.push("/"); // Redirect to home page after phone authentication
    } catch (err: any) {
      setError("Failed to verify code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
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
            onClick={() => {
              setIsPhoneAuth(false);
              setIsSignUp(false);
            }}
            className={`w-1/3 py-2 text-center ${
              !isPhoneAuth && !isSignUp
                ? "border-b-2 border-blue-500 font-bold"
                : ""
            }`}
          >
            Email Auth
          </button>
          <button
            onClick={() => {
              setIsPhoneAuth(false);
              setIsSignUp(true);
            }}
            className={`w-1/3 py-2 text-center ${
              isSignUp ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsPhoneAuth(true)}
            className={`w-1/3 py-2 text-center ${
              isPhoneAuth ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
          >
            Phone Auth
          </button>
        </div>

        <h1 className="text-xl font-bold mb-4">
          {isPhoneAuth
            ? "Phone Authentication"
            : isSignUp
            ? "Sign Up"
            : "Sign In"}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {resetEmailSent && (
          <p className="text-green-500 mb-4">
            Password reset email sent! Check your inbox.
          </p>
        )}

        {isPhoneAuth ? (
          <>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handlePhoneSignIn}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            <div id="recaptcha-container"></div>

            {confirmResult && (
              <>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="w-full bg-blue-500 text-white p-2 rounded mb-2"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </>
            )}
          </>
        ) : (
          <>
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

            {(isSignUp || isPhoneAuth) && (
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
          </>
        )}
      </div>
    </main>
  );
}

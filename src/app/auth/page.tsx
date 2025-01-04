"use client";

import { useState } from "react";
import EmailAuth from "@chat/components/EmailAuth";
import PhoneAuth from "@chat/components/PhoneAuth";

export default function AuthPage(): JSX.Element {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up
  const [isPhoneAuth, setIsPhoneAuth] = useState(false); // State to toggle between Phone Auth and Email Auth

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

        {isPhoneAuth ? <PhoneAuth /> : <EmailAuth isSignUp={isSignUp} />}
      </div>
    </main>
  );
}

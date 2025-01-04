"use client";

import { useMemo, useState } from "react";
import EmailAuth from "@chat/components/EmailAuth";
import PhoneAuth from "@chat/components/PhoneAuth";
import { Strings } from "@chat/util/strings";

export default function AuthPage(): JSX.Element {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Sign In and Sign Up
  const [isPhoneAuth, setIsPhoneAuth] = useState(false); // State to toggle between Phone Auth and Email Auth

  const authTitle = useMemo(() => {
    if (isPhoneAuth) {
      return Strings.PHONE_AUTHENTICATION;
    }
    if (isSignUp) {
      return Strings.SIGN_UP;
    }
    return Strings.SIGN_IN;
  }, [isPhoneAuth, isSignUp]);

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
            {Strings.EMAIL_AUTH}
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
            {Strings.SIGN_UP}
          </button>
          <button
            onClick={() => setIsPhoneAuth(true)}
            className={`w-1/3 py-2 text-center ${
              isPhoneAuth ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
          >
            {Strings.PHONE_AUTH}
          </button>
        </div>

        <h1 className="text-xl font-bold mb-4">{authTitle}</h1>

        {isPhoneAuth ? <PhoneAuth /> : <EmailAuth isSignUp={isSignUp} />}
      </div>
    </main>
  );
}

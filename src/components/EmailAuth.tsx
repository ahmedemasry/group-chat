import React, { useState } from "react";
import useEmailSignIn from "@chat/hooks/useEmailSignIn";
import useEmailSignUp from "@chat/hooks/useEmailSignUp";
import { Strings } from "@chat/util/strings";

interface EmailAuthProps {
  isSignUp: boolean;
}

const EmailAuth: React.FC<EmailAuthProps> = ({ isSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const {
    signIn,
    loading: signInLoading,
    error: signInError,
  } = useEmailSignIn();
  const {
    signUp,
    loading: signUpLoading,
    error: signUpError,
  } = useEmailSignUp();

  const handleSubmit = () => {
    if (isSignUp) {
      signUp(email, password, displayName);
    } else {
      signIn(email, password);
    }
  };

  return (
    <>
      <input
        type="email"
        placeholder={Strings.EMAIL_PLACEHOLDER}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder={Strings.PASSWORD_PLACEHOLDER}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {isSignUp && (
        <input
          type="text"
          placeholder={Strings.DISPLAY_NAME_PLACEHOLDER}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
      )}
      <button
        onClick={handleSubmit}
        disabled={isSignUp ? signUpLoading : signInLoading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2"
      >
        {isSignUp
          ? signUpLoading
            ? Strings.CREATING_ACCOUNT
            : Strings.SIGN_UP
          : signInLoading
          ? Strings.SIGNING_IN
          : Strings.SIGN_IN}
      </button>
      {isSignUp
        ? signUpError && (
            <p className="text-red-500 mb-4">{Strings.SIGN_UP_ERROR}</p>
          )
        : signInError && (
            <p className="text-red-500 mb-4">{Strings.SIGN_IN_ERROR}</p>
          )}
    </>
  );
};

export default EmailAuth;

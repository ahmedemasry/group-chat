import { useState } from "react";
import useEmailSignIn from "@chat/hooks/useEmailSignIn";
import useEmailSignUp from "@chat/hooks/useEmailSignUp";

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
        onClick={handleSubmit}
        disabled={isSignUp ? signUpLoading : signInLoading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2"
      >
        {isSignUp
          ? signUpLoading
            ? "Creating Account..."
            : "Sign Up"
          : signInLoading
          ? "Signing In..."
          : "Sign In"}
      </button>
      {isSignUp
        ? signUpError && <p className="text-red-500 mb-4">{signUpError}</p>
        : signInError && <p className="text-red-500 mb-4">{signInError}</p>}
    </>
  );
};

export default EmailAuth;

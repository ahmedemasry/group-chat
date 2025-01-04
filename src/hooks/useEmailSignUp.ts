import { useState } from "react";
import firebaseApp from "@chat/services/firebase";
import { useRouter } from "next/navigation";
import useCreateUserDocument from "@chat/hooks/useCreateUserDocument";

const useEmailSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    setError(null);

    // Validate fields before proceeding
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (!displayName) {
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

  return { signUp, loading, error };
};

export default useEmailSignUp;

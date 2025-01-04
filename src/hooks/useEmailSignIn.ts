import { useState } from "react";
import firebaseApp from "@chat/services/firebase";
import { useRouter } from "next/navigation";

const useEmailSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
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

  return { signIn, loading, error };
};

export default useEmailSignIn;

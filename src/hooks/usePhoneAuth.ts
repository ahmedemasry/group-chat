import { useState } from "react";
import firebaseApp from "@chat/services/firebase";
import { useRouter } from "next/navigation";
import firebase from "firebase/compat/app";

const usePhoneAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] =
    useState<firebase.auth.ConfirmationResult | null>(null);
  const router = useRouter();

  const sendOtp = async (phoneNumber: string) => {
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

  const verifyCode = async (verificationCode: string) => {
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

  return { sendOtp, verifyCode, loading, error, confirmResult };
};

export default usePhoneAuth;

import { useState } from "react";
import usePhoneAuth from "@chat/hooks/usePhoneAuth";

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const { sendOtp, verifyCode, loading, error, confirmResult } = usePhoneAuth();

  return (
    <>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={() => sendOtp(phoneNumber)}
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
            onClick={() => verifyCode(verificationCode)}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
    </>
  );
};

export default PhoneAuth;

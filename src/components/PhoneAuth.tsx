import { useState } from "react";
import usePhoneAuth from "@chat/hooks/usePhoneAuth";
import { Strings } from "@chat/util/strings";

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const { sendOtp, verifyCode, loading, error, confirmResult } = usePhoneAuth();

  return (
    <>
      <input
        type="text"
        placeholder={Strings.PHONE_NUMBER}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={() => sendOtp(phoneNumber)}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded mb-2"
      >
        {loading ? Strings.SENDING_OTP : Strings.SEND_OTP}
      </button>
      <div id="recaptcha-container"></div>

      {confirmResult && (
        <>
          <input
            type="text"
            placeholder="Verification Code"
            value={Strings.VERIFICATION_CODE}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={() => verifyCode(verificationCode)}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            {loading ? Strings.VERIFYING : Strings.VERIFY_CODE}
          </button>
        </>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
    </>
  );
};

export default PhoneAuth;

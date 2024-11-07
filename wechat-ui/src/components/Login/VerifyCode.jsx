import { useState } from "react";
import Reset2 from "../../assets/Reset2.png";

const VerifyCodePage = () => {
  const [code, setCode] = useState("");

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Verify code</h2>
        <p className="text-gray-600 mb-4">
          A verification code has been sent to your email.
        </p>
        <div className="mb-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter code"
          />
        </div>
        <button className="w-full bg-teal-500 text-white p-2 rounded">
          Verify
        </button>
        <p className="text-sm text-gray-600 mt-4">Didn't receive a code?</p>
      </div>
      <div className="w-1/2 bg-teal-50 flex items-center justify-center">
        <img
          src={Reset2}
          alt="Person with key and lock illustration"
          className="max-w-md"
        />
      </div>
    </div>
  );
};

export default VerifyCodePage;

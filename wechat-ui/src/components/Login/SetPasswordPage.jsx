import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import ResetImage from "../../assets/ResetImage.png";

const SetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex p-8 max-w-6xl mx-auto items-center">
      <div className="w-1/2 pr-8">
        <h1 className="text-3xl font-bold mb-2">Set a password</h1>
        <p className="text-gray-600 mb-6">
          Your previous password has been resetted. Please set a new password
          for your account.
        </p>

        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Create Password"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Re-enter Password"
          />
          <button
            className="absolute right-2 top-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        <button className="w-full bg-teal-500 text-white p-2 rounded">
          Set password
        </button>
      </div>

      <div className="w-1/2 pl-8">
        <img
          src={ResetImage}
          alt="Password reset illustration"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SetPasswordPage;

import { useState } from "react";

function Forgotform() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");

    console.log("Password reset link sent to:", email);
    setSuccessMessage("A password reset link has been sent to your email.");

    setEmail("");
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-lg items-center">
      <h2 className="text-2xl text-[#313131] font-bold mb-6">
        Forgot Password
      </h2>
      <p className="text-[#313131] py-4 text-sm">
        Don’t worry, happens to all of us. Enter your email below to recover
        your password
      </p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-[#26A69A] hover:bg-[#00796B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-center"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default Forgotform;

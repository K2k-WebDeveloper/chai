import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import facebook from "../../../assets/facebook.png";
import google from "../../../assets/google.png";
import apple from "../../../assets/apple.png";
import { loginRoute } from "../../../Utils/AllApi";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const url = "https://chat-app-demo-9e8a.onrender.com/api/auth/login";
      const { data } = await axios.post(url, { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("Puser", data.user.id);
      localStorage.setItem("Pemail", data.user.email);
      console.log("Puser -> token", data.user.id);

      setError("");
      navigate("/app");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(
          error.response.data.message || "An error occurred during login."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-lg">
      <h2 className="text-2xl text-[#313131] font-bold mb-6">Login</h2>
      <p className="text-[#313131] py-4 text-sm">
        Login to access your Travelwise account
      </p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remember Me
          </label>
          <a
            href="/forgotpassword"
            className="ml-auto text-sm font-medium text-[#FF8682]"
          >
            Forgot Password
          </a>
        </div>

        <button
          type="submit"
          className="text-white bg-[#26A69A] hover:bg-[#00796B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-center"
        >
          Login
        </button>
        <p className="text-[12px] text-[#313131] text-center py-3">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleSignUpClick}
            className="text-[#FF8682]"
          >
            Sign Up
          </button>
        </p>
        <p className="text-[12px] text-[#908d8d] text-center py-2">
          Or Sign Up with
        </p>
        <div className="py-4 flex justify-center items-center gap-10 mx-2">
          <div className="shadow-black border w-16 flex justify-center cursor-pointer">
            <img src={facebook} alt="Facebook" />
          </div>
          <div className="shadow-black border w-16 flex justify-center cursor-pointer">
            <img src={google} alt="Google" />
          </div>
          <div className="shadow-black border w-16 flex justify-center cursor-pointer">
            <img src={apple} alt="Apple" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

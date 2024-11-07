import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { host } from "../../../Utils/AllApi.js";

// import { registerRoute } from "../../../Utils/AllApi";

function SignupForm() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data.password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      const url = "https://chat-app-demo-9e8a.onrender.com/api/users";
      const response = await axios.post(url, data);
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-lg items-center ">
      <h2 className="text-2xl text-[#313131] font-bold mb-6">Sign Up</h2>
      <p className="text-[#313131] py-4 text-sm">
        Let's get you all set up so you can access your personal account.
      </p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-5 flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Your First Name"
              onChange={handleChange}
              value={data.firstName}
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Your Last Name"
              onChange={handleChange}
              value={data.lastName}
              required
            />
          </div>
        </div>

        <div className="mb-5 flex gap-4">
          <div className="w-1/2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Your Email"
              onChange={handleChange}
              value={data.email}
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Your Phone Number"
              onChange={handleChange}
              value={data.mobile}
              required
            />
          </div>
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
            name="password"
            className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Password"
            onChange={handleChange}
            value={data.password}
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium dark:text-[#1C1B1F]"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="shadow-sm bg-gray-50 border border-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Confirm Your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="ms-2 text-sm font-medium  text-[#313131]"
          >
            I agree to all the Terms and Privacy Policies
          </label>
        </div>
        

        <button
          type="submit"
          className="text-white bg-[#26A69A] hover:bg-[#00796B] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-center"
        >
          Sign Up
        </button>
        <p className="text-[12px] text-[#313131] text-center py-3">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")} 
            className="text-[#FF8682]"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;

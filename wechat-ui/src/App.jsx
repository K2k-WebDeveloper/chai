// import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Login/Signup/Signup";
import Forgot from "./components/Login/Forgot/Forgot";
import Login from "./components/Login/Login/Login";
import ChatApp from "./components/Chat-Sys/ChatApp";
import SetPasswordPage from "./components/Login/SetPasswordPage";
import VerifyPage from "./components/Login/VerifyCode";

function App() {
  const user = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {user && <Route path="/" exact element={<ChatApp />} />}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgot />} />
        <Route path="/" element={<Navigate replace to="/login" />} />

        <Route path="/app" element={<ChatApp />} />
        <Route path="/reset" element={<SetPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

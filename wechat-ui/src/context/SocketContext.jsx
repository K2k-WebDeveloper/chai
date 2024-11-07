// contexts/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import IncomingCallDialog from "../components/Chat-Sys/ChatComponents/IncomingCallDialog.jsx";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("Puser");
    const userName = localStorage.getItem("Puser");

    const newSocket = io("https://chat-app-demo-9e8a.onrender.com");

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("register", { userId, userName });
      console.log("user", userId);
    });

    newSocket.on("incoming-call-request", (data) => {
      setIncomingCall(data);
    });

    newSocket.on("users-online", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleAcceptCall = async () => {
    if (incomingCall && socket) {
      socket.emit("call-accepted", {
        callerId: incomingCall.callerId,
        receiverId: localStorage.getItem("Puser"),
      });
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall && socket) {
      socket.emit("call-rejected", {
        callerId: incomingCall.callerId,
        receiverId: localStorage.getItem("Puser"),
        reason: "Call rejected by user",
      });
      setIncomingCall(null);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
      <IncomingCallDialog
        open={!!incomingCall}
        caller={incomingCall}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </SocketContext.Provider>
  );
};

import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import ProfileSidebar from "./ChatComponents/ProfileSidebar";
import AudioCallComponent from "./ChatComponents/AudioCallComponent";
import VideoComponent from "./ChatComponents/VideoCallComponent";
import { io } from "socket.io-client";
import chatbg from "../../assets/chatbg.png";
import logo from "../../assets/logo.jpg";

import {
  SearchIcon,
  SidebarIcon,
  VideosIcon,
  AddIcon,
  EmojiIcon,
  PhotoIcon,
  RecordIcon,
  AudioCallIcon,
} from "./Icons";

const SOCKET_URL = "https://chat-app-demo-9e8a.onrender.com";
const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif"],
  video: ["video/mp4", "video/webm"],
  audio: ["audio/mp3", "audio/wav", "audio/mpeg"],
  document: ["application/pdf", "application/msword", "text/plain"],
};
const DRUG_RELATED_TERMS = ["coke", "blow", "snow", "flake", "powder", "yeyo", "rock", "girl", "pearl", "8-ball", "sugar", "nose candy", "white", "yayo", "fish scale"];
const keywordCounter = {}; // Object to keep track of keyword counts

const checkForKeywords = (text) => {
  let found = false;
  DRUG_RELATED_TERMS.forEach((term) => {
    if (text.toLowerCase().includes(term)) {
      keywordCounter[term] = (keywordCounter[term] || 0) + 1;
      found = true;
    }
  });
  return found;
};

function ChatArea({ activeUser }) {
  const userId = localStorage.getItem("Puser");
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [messagesByContact, setMessagesByContact] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // useEffect(() => {
  //   console.log("Socket initialized:", socket);
  // }, [socket]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("register", userId);
    });

    newSocket.on("receive-message", (data) => {
      setMessagesByContact((prev) => ({
        ...prev,
        [data.senderId]: [
          ...(prev[data.senderId] || []),
          {
            senderId: data.senderId,
            content: data.message,
            type: data.type,
            timestamp: data.timestamp,
          },
        ],
      }));
    });
    // const scrollToBottom = () => {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${SOCKET_URL}/chat-history/${userId}`);
        const history = await response.json();

        // Organize messages by contact
        const messagesByContactId = {};
        history.forEach((msg) => {
          const contactId =
            msg.senderId === userId ? msg.receiverId : msg.senderId;
          if (!messagesByContactId[contactId]) {
            messagesByContactId[contactId] = [];
          }
          messagesByContactId[contactId].push({
            senderId: msg.senderId,
            content: msg.content,
            timestamp: msg.timestamp,
            type: msg.type,
          });
        });

        setMessagesByContact(messagesByContactId);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    // fetchChatHistory();

    return () => newSocket.close();
  }, [userId]);

  // Handle starting audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioBlob);
        setAudioPreview(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const sendRecordedAudio = async () => {
    if (!recordedAudio) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", recordedAudio, "audio-message.webm");
    formData.append("senderId", userId);
    formData.append("receiverId", activeUser._id);

    try {
      const response = await fetch(`${SOCKET_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        const messageData = {
          senderId: userId,
          receiverId: activeUser._id,
          message: data.url,
          type: "audio",
        };


        setMessagesByContact((prev) => ({
          ...prev,
          [activeUser._id]: [
            ...(prev[activeUser._id] || []),
            {
              senderId: userId,
              content: data.url,
              type: "audio",
              timestamp: new Date(),
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Error uploading audio message");
    } finally {
      setIsUploading(false);
      setRecordedAudio(null);
      setAudioPreview(null);
    }
  };

  const cancelRecordedAudio = () => {
    setRecordedAudio(null);
    setAudioPreview(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isValidType = Object.values(ALLOWED_FILE_TYPES)
      .flat()
      .includes(file.type);
    if (!isValidType) {
      alert("Invalid file type");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", userId);
    formData.append("receiverId", activeUser._id);

    try {
      const response = await fetch(`${SOCKET_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        const messageData = {
          senderId: userId,
          receiverId: activeUser._id,
          message: data.url,
          type: getFileType(file.type),
        };

        // socket.emit("private-message", messageData);

        setMessagesByContact((prev) => ({
          ...prev,
          [activeUser._id]: [
            ...(prev[activeUser._id] || []),
            {
              senderId: userId,
              content: data.url,
              type: getFileType(file.type),
              timestamp: new Date(),
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileType = (mimeType) => {
    if (ALLOWED_FILE_TYPES.image.includes(mimeType)) return "image";
    if (ALLOWED_FILE_TYPES.video.includes(mimeType)) return "video";
    if (ALLOWED_FILE_TYPES.audio.includes(mimeType)) return "audio";
    return "document";
  };

  const renderMessage = (msg) => {

    const isFileUrl = (url) => {
      const extensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "pdf",
        "mp4",
        "mp3",
        "webm",
        "xls",
        "xlsx",
        "ppt",
        "xlsm",
        "wav",
      ];
      return extensions.some((ext) => url.toLowerCase().endsWith(ext));
    };

    if (isFileUrl(msg.content)) {
      console.log("msg type", msg.type);
      switch (msg.type) {
        case "image":
          return (
            <img
              src={msg.content}
              alt="Shared Image"
              className="max-w-xs rounded"
            />
          );
        case "video":
          return (
            <video controls className="max-w-xs">
              <source src={msg.content} type="video/mp4" />
            </video>
          );
        case "audio":
          return (
            <audio controls className="max-w-xs">
              <source src={msg.content} type="audio/webm" />
            </audio>
          );
        case "document":
          return (
            <a
              href={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-500 hover:underline"
            >
              Open Document
            </a>
          );
        default:
          return <div>Unsupported file format</div>;
      }
    } else {
      return <div>{msg.content}</div>;
    }
  };

  const handleSend = () => {
    if (audioPreview) {
      sendRecordedAudio();
    } else if (message.trim() && socket && activeUser) {
      const messageData = {
        senderId: userId,
        receiverId: activeUser._id,
        message: message.trim(),
      };

      socket.emit("private-message", messageData);

      setMessagesByContact((prev) => ({
        ...prev,
        [activeUser._id]: [
          ...(prev[activeUser._id] || []),
          {
            senderId: userId,
            content: message.trim(),
            timestamp: new Date(),
            type: "text",
          },
        ],
      }));

      setMessage("");
    }
  };
  const [showWarning, setShowWarning] = useState(false);
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
  
    const containsKeyword = checkForKeywords(message);
  
    if (containsKeyword) {
      // Check if any term has reached the threshold of 5 uses
      const overuseDetected = Object.values(keywordCounter).some(count => count >= 5);
      if (overuseDetected) {
        alert("Warning: This chat contains flagged terms used excessively.");
      }
    }
  
    // Send the message to the server or local state
    socket.emit("private-message", { senderId: userId, receiverId: activeUser._id, message });
  
    // Reset message input
    setMessage(""); 
    if (overuseDetected) {
      setShowWarning(true);
    }
  };
  // Popup Component
{showWarning && (
  <div className="warning-popup">
    <p>Warning: Excessive use of flagged terms detected.</p>
    <button onClick={() => setShowWarning(false)}>Close</button>
  </div>
)}
  
  const currentMessages = messagesByContact[activeUser?._id] || [];

  if (!activeUser) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${chatbg})` }}
      >
        <p className="text-[#26A69A] font-bold text-[40px] text-center">
          Select a contact to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      

      <div className="bg-white p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
            {/* <span className="text-xl text-gray-600">
              {activeUser.firstName?.[0]}
            </span> */}
            <img
              src={`https://chat-app-demo-9e8a.onrender.com/${activeUser.avatar}`}
              alt={activeUser.firstName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-green-600">
              {activeUser.firstName} {activeUser.lastName}
            </h2>
            <p className="text-sm text-gray-500">{activeUser.email}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsAudioCallOpen(true)}
          >
            <AudioCallIcon />
          </button>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsVideoCallOpen(true)}
          >
            <VideosIcon />
          </button>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <SidebarIcon />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {(messagesByContact[activeUser._id] || []).map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 ${
                msg.senderId === userId
                  ? "bg-[#26A69A] text-white"
                  : "bg-gray-100"
              }`}
            >
              {renderMessage(msg)}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <EmojiIcon />
          </button>
          {showEmojis && (
            <div className="absolute bottom-16 left-0">
              <EmojiPicker
                onEmojiClick={(emojiObject) =>
                  setMessage((prev) => prev + emojiObject.emoji)
                }
              />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <AddIcon />
          </button>

          {isUploading && (
            <div className="h-1 w-20 bg-gray-200 rounded">
              <div
                className="h-full bg-[#26A69A] rounded"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message"
            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#26A69A]"
          />
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full ${
              isRecording
                ? "bg-red-500 animate-pulse"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <RecordIcon />
          </button>

          {isUploading && (
            <div className="h-1 w-20 bg-gray-200 rounded">
              <div
                className="h-full bg-[#26A69A] rounded"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {audioPreview ? (
            <div className="flex items-center space-x-2">
              <audio src={audioPreview} controls className="h-8 w-32" />
              <button
                className="p-2 rounded-full bg-gray-500 hover:bg-[#26A69A] text-white"
                onClick={handleSend}
              >
                <SearchIcon />
              </button>
              <button
                onClick={cancelRecordedAudio}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="p-2 rounded-full bg-gray-500 hover:bg-[#26A69A] text-white"
              onClick={handleSend}
            >
              <SearchIcon />
            </button>
          )}

          {/* <button
            className="p-2 rounded-full bg-gray-500 hover:bg-[#26A69A] text-white"
            onClick={handleSend}
          >
            <SearchIcon />
          </button> */}
        </div>
      </div>

      <ProfileSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        contact={activeUser}
        muteModalOpen={muteModalOpen}
        onMuteClick={() => setMuteModalOpen(true)}
        onMuteClose={() => setMuteModalOpen(false)}
        onMute={(duration) => console.log(`Muted for ${duration} minutes`)}
      />
      <AudioCallComponent
        open={isAudioCallOpen}
        onClose={() => setIsAudioCallOpen(false)}
        contact={activeUser}
        socket={socket}
      />
      <VideoComponent
        open={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        contact={activeUser}
        socket={socket}
      />
    </div>
  );
}

export default ChatArea;

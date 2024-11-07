// import { useState } from "react";
// import { IconButton, Typography, Box, Dialog } from "@mui/material";
// import {
//   Close as CloseIcon,
//   Mic as MicIcon,
//   MicOff as MicOffIcon,
//   CallEnd as CallEndIcon,
// } from "@mui/icons-material";

// import {
//   AddMemberIcon,
//   VideoCallIcon,
//   MiceIcon,
//   OptionsIcon2,
//   EndCallIcon,
// } from "../Icons";

// const AudioCallComponent = ({ open, onClose, contact }) => {
//   const UserId = localStorage.getItem("Puser");
//   // console.log("Audio Component logged user", UserId);

//   const [isFullScreen, setIsFullScreen] = useState(false);

//   const toggleFullScreen = () => {
//     setIsFullScreen(!isFullScreen);
//   };

//   const [isMuted, setIsMuted] = useState(false);

//   const handleMuteToggle = () => {
//     setIsMuted(!isMuted);
//   };

//   const handleEndCall = () => {
//     onClose();
//   };
//   // console.log("user inside audio call", contact);
//   return (
//     <Dialog
//       anchor="center"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: "100%",
//           maxWidth: 400,
//           backgroundColor: "#E0F2F1",
//         },
//       }}
//     >
//       <Box
//         sx={{
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           backgroundColor: "#FFFFFF",
//           padding: 2,
//           alignItems: "center",
//           justifyContent: "space-between",
//           width: "100%",
//         }}
//       >
//         <Box
//           sx={{
//             height: "100%",
//             display: "flex",
//             width: "100%",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: 3,
//             backgroundColor: "#E0F2F1",
//           }}
//         >
//           <Box sx={{ width: "100%", textAlign: "right" }}>
//             <IconButton onClick={onClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               component="img"
//               src={contact?.avatar}
//               alt={contact?.firstName}
//               sx={{
//                 width: 120,
//                 height: 120,
//                 borderRadius: "50%",
//                 marginBottom: 2,
//               }}
//             />
//             <Typography variant="h6" sx={{ color: "#26A69A" }}>
//               {contact?.firstName} {contact?.lastName}
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#64748B" }}>
//               Ringing...
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ display: "flex", gap: 3, my: 2 }}>
//           <IconButton
//             onClick={handleMuteToggle}
//             sx={{
//               backgroundColor: "#26A69A",
//               color: "white",
//               "&:hover": { backgroundColor: "#2c8f86" },
//             }}
//           >
//             {isMuted ? <MicOffIcon /> : <MicIcon />}
//           </IconButton>
//           <IconButton
//             onClick={handleEndCall}
//             sx={{
//               backgroundColor: "#ef5350",
//               color: "white",
//               "&:hover": { backgroundColor: "#e53935" },
//             }}
//           >
//             <CallEndIcon />
//           </IconButton>
//         </Box>
//       </Box>
//     </Dialog>
//   );
// };

// export default AudioCallComponent;

// AudioCall.jsx

import { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Typography,
  Box,
  Dialog,
  Snackbar,
  Button,
  Avatar,
} from "@mui/material";

import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
// import { io } from "socket.io-client";

const AudioCall = ({ open, onClose, contact, socket }) => {
  const userId = localStorage.getItem("Puser");
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const [otherUserId, setOtherUserId] = useState("");
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(new RTCPeerConnection());

  useEffect(() => {
    socket.emit("register", userId);
    setOtherUserId(contact._id);

    // Listen for incoming call events
    socket.on("incoming-audio-call", async ({ callerId, signalData }) => {
      setIncomingCall(true);
      setCallerId(callerId);
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(signalData)
      );
    });

    socket.on("audio-call-answered", async ({ signalData }) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(signalData)
      );
      setInCall(true);
    });

    socket.on("audio-call-ended", () => {
      endCall();
    });

    socket.on("candidate", async ({ candidate }) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    return () => {
      socket.off("incoming-audio-call");
      socket.off("audio-call-answered");
      socket.off("audio-call-ended");
      socket.off("candidate");
    };
  }, []);

  // Initiate a call
  const initiateCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream
        .getTracks()
        .forEach((track) => peerConnectionRef.current.addTrack(track, stream));
      localStreamRef.current.srcObject = stream;

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("initiate-audio-call", {
        callerId: userId,
        receiverId: otherUserId,
        signalData: offer,
      });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  // Answer an incoming call
  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream
        .getTracks()
        .forEach((track) => peerConnectionRef.current.addTrack(track, stream));
      localStreamRef.current.srcObject = stream;

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer-audio-call", {
        receiverId: callerId,
        signalData: answer,
      });
      setIncomingCall(false);
      setInCall(true);
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  // End the call
  const endCall = () => {
    peerConnectionRef.current.close();
    if (localStreamRef.current && localStreamRef.current.srcObject) {
      localStreamRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    socket.emit("end-audio-call", { otherUserId });
    setInCall(false);
    setIncomingCall(false);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    const stream = localStreamRef.current.srcObject;
    if (stream) {
      stream.getAudioTracks()[0].enabled = !isMuted;
    }
  };

  // Handle ICE candidates
  peerConnectionRef.current.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("candidate", {
        candidate: event.candidate,
        to: otherUserId,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 400,
          p: 2,
          backgroundColor: "#E0F7FA",
          borderRadius: 3,
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Contact Information */}
        <Avatar
          src={`https://chat-app-demo-9e8a.onrender.com/${contact.avatar}`}
          alt={contact.firstName}
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        <Typography variant="h6">
          {contact.firstName} {contact.lastName}
        </Typography>

        {/* Call Controls */}
        <Box mt={3} display="flex" gap={2}>
          {inCall ? (
            <>
              <IconButton color="error" onClick={endCall}>
                <CallEndIcon fontSize="large" />
              </IconButton>
              <IconButton color="primary" onClick={toggleMute}>
                {isMuted ? (
                  <MicOffIcon fontSize="large" />
                ) : (
                  <MicIcon fontSize="large" />
                )}
              </IconButton>
            </>
          ) : incomingCall ? (
            <>
              <IconButton color="primary" onClick={answerCall}>
                <PhoneIcon fontSize="large" />
              </IconButton>
              <IconButton color="error" onClick={endCall}>
                <CallEndIcon fontSize="large" />
              </IconButton>
            </>
          ) : (
            <IconButton color="primary" onClick={initiateCall}>
              <PhoneIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
        <audio
          ref={localStreamRef}
          autoPlay
          controls
          style={{ display: "none" }}
        />
      </Box>
    </Dialog>
  );
};

export default AudioCall;

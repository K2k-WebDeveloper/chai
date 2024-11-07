import { useState, useEffect, useRef } from "react";
import { IconButton, Typography, Box, Dialog } from "@mui/material";
import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from "@mui/icons-material";
import IncomingCallDialog from "./IncomingCallDialog"; 

const VideoCallComponent = ({ open, onClose, contact, socket }) => {
  const userId = localStorage.getItem("Puser");

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [incomingSignal, setIncomingSignal] = useState(null);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();

  const servers = {
    iceServers: [{ urls: ["stun:stun1.l.google.com:19302"] }],
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("callUser", ({ from, signal }) => {
      setIsReceivingCall(true);
      setIncomingSignal(signal);
      initializePeerConnection();
      peerConnection.current = new RTCPeerConnection(servers);

      //  parsed signal with RTCSessionDescriptioninit structure
      // const remoteDesc = new RTCSessionDescription({
      //   type: signal.type,
      //   sdp: signal.sdp,
      // });
      // console.log("remoteDesc on useEffect", remoteDesc);

      // peerConnection.current
      //   .setRemoteDescription(remoteDesc)
      //   .then(() => console.log("Remote description set successfully"))
      //   .catch((err) =>
      //     console.error("Error setting remote description:", err)
      //   );

      peerConnection.current.ontrack = (event) => {
        console.log("getting video track remotely ", event);
        if (remoteVideoRef.current) {
          setRemoteStream(event.streams[0]);
          console.log("Remote stream set successfully:", event.streams[0]);
          console.log("remote Stream ", remoteStream);

          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { to: from, candidate: event.candidate });
        }
      };
    });

    socket.on("callAccepted", async (signal) => {
      if (peerConnection.current) {
        try {
          console.log("Signal inside callAccepted", signal);
          const answerDesc = new RTCSessionDescription(signal);
          await peerConnection.current.setRemoteDescription(answerDesc);
          setCallAccepted(true);
          console.log("Answer SDP set successfully");
        } catch (error) {
          console.error("Failed to set remote description:", error);
        }
      } else {
        console.error("peerConnection.current is undefined in callAccepted");
      }
    });

    // socket.on("iceCandidate", async ({ candidate }) => {
    //   if (peerConnection.current && candidate) {
    //     await peerConnection.current.addIceCandidate(
    //       new RTCIceCandidate(candidate)
    //     );
    //   }
    // });

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("iceCandidate");
    };
  }, [socket]);

  const initializePeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.onicecandidate = (event) => {
      console.log("iceCandidate ", event.Candidate);

      if (event.candidate) {
        socket.emit("iceCandidate", {
          to: contact._id,
          candidate: event.candidate,
        });
      }
    };
  };

  // const startCall = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   setLocalStream(stream);
  //   localVideoRef.current.srcObject = stream;

  //   const peer = new RTCPeerConnection(servers);
  //   peerConnection.current = peer;
  //   stream.getTracks().forEach((track) => peer.addTrack(track, stream));

  //   peer.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socket.emit("iceCandidate", {
  //         to: contact._id,
  //         candidate: event.candidate,
  //       });
  //     }
  //   };

  //   peer.ontrack = (event) => {
  //     setRemoteStream(event.streams[0]);
  //     remoteVideoRef.current.srcObject = event.streams[0];
  //   };

  //   const offer = await peer.createOffer();
  //   await peer.setLocalDescription(offer);

  //   // Emit signal with correct structure
  //   socket.emit("callUser", {
  //     userToCall: contact._id,
  //     from: userId,
  //     signalData: { type: offer.type, sdp: offer.sdp },
  //   });
  //   setIsCalling(true);
  // };
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;
    initializePeerConnection();
    console.log("add local stream to peer connection", localStream);

    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    console.log("offer", offer);

    await peerConnection.current.setLocalDescription(offer);
    socket.emit("callUser", {
      userToCall: contact._id,
      from: userId,
      signalData: offer,
    });
    setIsCalling(true);
  };

  const answerCall = async () => {
    if (!incomingSignal) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;
    initializePeerConnection();

    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    const remoteDesc = new RTCSessionDescription(incomingSignal);
    console.log("remote description", remoteDesc);
    await peerConnection.current.setRemoteDescription(remoteDesc);

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answerCall", { to: contact._id, signal: answer });
    setCallAccepted(true);
    setIsReceivingCall(false);
  };

  const endCall = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (peerConnection.current) peerConnection.current.close();

    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setCallAccepted(false);
    setIsReceivingCall(false);
    onClose();
    socket.emit("endCall", { to: contact._id });
  };
  const toggleMute = () => {
    if (localStream) {
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IncomingCallDialog
        open={isReceivingCall}
        caller={contact}
        onAccept={answerCall}
        onReject={endCall}
      />
      <Box sx={{ p: 2, bgcolor: "#1a1a1a", color: "white" }}>
        <Box sx={{ display: "flex", gap: 2, height: "400px" }}>
          <Box sx={{ flex: 1, bgcolor: "#000" }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box sx={{ width: "200px", bgcolor: "#000" }}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          <IconButton
            onClick={toggleMute}
            sx={{ bgcolor: isMuted ? "#ef5350" : "#26A69A", color: "white" }}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton
            onClick={toggleVideo}
            sx={{ bgcolor: isVideoOff ? "#ef5350" : "#26A69A", color: "white" }}
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
          <IconButton
            onClick={endCall}
            sx={{ bgcolor: "#ef5350", color: "white" }}
          >
            <CallEndIcon />
          </IconButton>
          {!isCalling && !callAccepted && (
            <IconButton
              onClick={startCall}
              sx={{ bgcolor: "#26A69A", color: "white" }}
            >
              <CallEndIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default VideoCallComponent;

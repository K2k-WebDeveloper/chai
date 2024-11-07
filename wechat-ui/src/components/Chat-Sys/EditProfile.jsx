import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  styled,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { PhotoIcon } from "./Icons";

import axios from "axios";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
});

const StyledSelect = styled(Select)({
  borderRadius: "8px",
});
const ImageUploadButton = styled(Button)({
  position: "absolute",
  bottom: 0,
  right: 0,
  minWidth: "36px",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  padding: 0,
  backgroundColor: "#00796B",
  "&:hover": {
    backgroundColor: "#00695C",
  },
});

const AvatarWrapper = styled("div")({
  width: 120,
  height: 120,
  borderRadius: "50%",
  border: "2px solid #00796B",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f5f5",
});

const AvatarImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const EditProfile = ({ onClose }) => {
  const userId = localStorage.getItem("Puser");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://chat-app-demo-9e8a.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhoneNumber(userData.mobile);
        if (userData.avatar) {
          setAvatarPreview(
            `https://chat-app-demo-9e8a.onrender.com/${userData.avatar}`
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      console.log(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authorization token is missing. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("mobile", phoneNumber);
      if (avatarFile) {
        if (!avatarFile.type.startsWith("image/")) {
          alert("Only image files are allowed.");
          return;
        }
        formData.append("avatar", avatarFile);
      }

      const response = await axios.put(
        "https://chat-app-demo-9e8a.onrender.com/api/users/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(`Error updating profile: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please try again.");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "#f0f9f9", minHeight: "100vh", width: "100%", p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onClose}
          sx={{ color: "#00796B", fontWeight: "bold" }}
        >
          Edit Profile
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <AvatarWrapper>
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Profile" />
                ) : (
                  <PhotoIcon />
                )}
              </AvatarWrapper>
              <input
                accept="image/*"
                type="file"
                id="avatar-input"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="avatar-input">
                <ImageUploadButton component="span">
                  <PhotoIcon />
                </ImageUploadButton>
              </label>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Personal Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
            Edit Your personal info
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <StyledTextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <StyledTextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Email: {email}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <StyledTextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <StyledSelect
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="India">India</MenuItem>
              <MenuItem value="USA">USA</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
            </StyledSelect>
          </Box>
          <Button
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              bgcolor: "#00796B",
              "&:hover": {
                bgcolor: "#00695C",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditProfile;

// import { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   styled,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import axios from "axios"; // To make HTTP requests

// const StyledTextField = styled(TextField)({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px",
//   },
// });

// const StyledSelect = styled(Select)({
//   borderRadius: "8px",
// });

// const EditProfile = ({ onClose }) => {
//   const userId = localStorage.getItem("Puser");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [country, setCountry] = useState("India");

//   // Fetch user data when the component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("https://chat-app-demo-9e8a.onrender.com/api/users/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const userData = response.data;
//         setFirstName(userData.firstName);
//         setLastName(userData.lastName);
//         setEmail(userData.email);
//         setPhoneNumber(userData.mobile);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         "https://chat-app-demo-9e8a.onrender.com/api/users/me",
//         { firstName, lastName, mobile: phoneNumber },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   return (
//     <Box sx={{ bgcolor: "#f0f9f9", minHeight: "100vh", width: "100%", p: 4 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={onClose}
//           sx={{ color: "#00796B", fontWeight: "bold" }}
//         >
//           Edit Profile
//         </Button>
//       </Box>
//       <form onSubmit={handleSubmit}>
//         <Box
//           sx={{
//             bgcolor: "white",
//             p: 4,
//             borderRadius: 2,
//             maxWidth: "800px",
//             margin: "0 auto",
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
//             Personal Information
//           </Typography>
//           <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
//             Edit Your personal info
//           </Typography>
//           <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//             <StyledTextField
//               label="First Name"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               fullWidth
//               variant="outlined"
//             />
//             <StyledTextField
//               label="Last Name"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               fullWidth
//               variant="outlined"
//             />
//           </Box>
//           <Typography variant="body1" sx={{ mb: 1 }}>
//             Email: {email}
//           </Typography>
//           <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//             <StyledTextField
//               label="Phone Number"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               fullWidth
//               variant="outlined"
//             />
//             <StyledSelect
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               fullWidth
//               variant="outlined"
//             >
//               <MenuItem value="India">India</MenuItem>
//               <MenuItem value="USA">USA</MenuItem>
//               <MenuItem value="UK">UK</MenuItem>
//             </StyledSelect>
//           </Box>
//           <Button variant="contained" type="submit" sx={{ mt: 2 }}>
//             Save Changes
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default EditProfile;

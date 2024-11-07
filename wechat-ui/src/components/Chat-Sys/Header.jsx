import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Dialog, Box } from "@mui/material";
import EditProfile from "./EditProfile";
import logo from "../../assets/logo.jpg";
import profile from "../../assets/profile.png";
import { ChatIcon, ContactsIcon, NotificationIcon } from "./Icons";
import axios from "axios";

const Header = ({
  onEditProfile,
  onToggleSidebar,
  activeSidebar,
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [userData, setUserData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const navigate = useNavigate();

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
        setUserData(response.data);
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

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleClose();
    onEditProfile();
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const iconButtonClass =
    "p-2 rounded-full transition-colors bg-white text-gray-600 hover:bg-gray-200";
  const activeIconButtonClass =
    "p-2 rounded-full transition-colors bg-[#E0F2F1] text-gray-800";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Left Section - Logo and Icons */}
        <Box className="flex items-center space-x-2 md:space-x-5 mb-2 md:mb-0">
          <img
            src={logo}
            alt="logo"
            style={{ height: "55px", borderRadius: "100%" }}
          />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">CHAI</h1>
          <div className="flex space-x-1">
            {/* <IconButton
              className={
                activeSidebar === "chat"
                  ? activeIconButtonClass
                  : iconButtonClass
              }
              onClick={() => onToggleSidebar("chat")}
            >
              <ChatIcon />
            </IconButton> */}
            {/* <IconButton
              className={
                activeSidebar === "contacts"
                  ? activeIconButtonClass
                  : iconButtonClass
              }
              onClick={() => onToggleSidebar("contacts")}
            >
              <ContactsIcon />
            </IconButton> */}
          </div>
        </Box>

        {/* Right Section - Notifications and Profile */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <p className="text-black text-1xl font-extrabold text-center">
            {userData.firstName || "User Name"}
          </p>
          {/* <IconButton className={iconButtonClass}>
            <NotificationIcon />
          </IconButton> */}

          <IconButton onClick={handleProfileClick}>
            <Avatar
              src={
                userData && userData.avatar
                  ? `https://chat-app-demo-9e8a.onrender.com/${userData.avatar}`
                  : "/api/placeholder/32/32"
              }
              alt="Profile"
            />
          </IconButton>
        </div>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
        <EditProfile onClose={() => setOpenEditProfile(false)} />
      </Dialog>
    </header>
  );
};

export default Header;

// import React from "react";
// import { Avatar, IconButton } from "@mui/material";
// import {
//   ChatIcon,
//   ContactsIcon,
//   SearchIcon,
//   AddIcon,
//   NotificationIcon,
// } from "./Icons";

// const Header = ({ onEditProfile, onToggleSidebar, activeSidebar }) => {
//   const iconButtonClass =
//     "p-2 rounded-full transition-colors bg-white text-gray-600 hover:bg-gray-200";
//   const activeIconButtonClass =
//     "p-2 rounded-full transition-colors bg-[#E0F2F1] text-gray-800";

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-4 py-2 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800">WECHAT</h1>
//         <div className="flex items-center space-x-4">
//           <IconButton
//             className={
//               activeSidebar === "chat" ? activeIconButtonClass : iconButtonClass
//             }
//             onClick={() => onToggleSidebar("chat")}
//           >
//             <ChatIcon />
//           </IconButton>
//           <IconButton
//             className={
//               activeSidebar === "contacts"
//                 ? activeIconButtonClass
//                 : iconButtonClass
//             }
//             onClick={() => onToggleSidebar("contacts")}
//           >
//             <ContactsIcon />
//           </IconButton>

//           <IconButton className={iconButtonClass}>
//             <NotificationIcon />
//           </IconButton>
//           <IconButton onClick={onEditProfile}>
//             <Avatar src="/api/placeholder/32/32" alt="Profile" />
//           </IconButton>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

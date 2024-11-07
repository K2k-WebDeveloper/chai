import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContactsSidebar from "./ContactSideBar";
import ChatArea from "./ChatArea";
import UpdateNotification from "./UpdateNotification";
import EditProfile from "./EditProfile";
import Login from "../Login/Login/Login";
import axios from "axios";
import { SocketProvider } from "..//../context/SocketContext.jsx";
function ChatApp() {
  const [showNotification, setShowNotification] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("chat");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUsers();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://chat-app-demo-9e8a.onrender.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSelectUser = (userId) => {
    const selectedUser = users.find((user) => user._id === userId);
    setActiveUser(selectedUser);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const toggleSidebar = (sidebarType) => {
    setActiveSidebar(sidebarType);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SocketProvider>
      <div className="flex flex-col h-screen bg-#E0F2F1">
        <Header
          onEditProfile={handleEditProfile}
          onToggleSidebar={toggleSidebar}
          activeSidebar={activeSidebar}
          onLogout={handleLogout}
        />
        <div className="flex flex-1 overflow-hidden">
          {showEditProfile ? (
            <EditProfile onClose={handleCloseEditProfile} />
          ) : (
            <>
              {activeSidebar === "chat" ? (
                <Sidebar
                  onSelectUser={handleSelectUser}
                  activeUserId={activeUser?._id}
                  users={users}
                />
              ) : (
                <ContactsSidebar
                  onSelectUser={handleSelectUser}
                  activeUserId={activeUser?._id}
                  users={users}
                />
              )}
              <ChatArea activeUser={activeUser} />
            </>
          )}
        </div>
        {showNotification && (
          <UpdateNotification onDismiss={() => setShowNotification(false)} />
        )}
      </div>
    </SocketProvider>
  );
}

export default ChatApp;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import ContactsSidebar from "./ContactSideBar";
// import ChatArea from "./ChatArea";
// import UpdateNotification from "./UpdateNotification";
// import EditProfile from "./EditProfile";
// import Login from "../Login/Login/Login";
// import axios from "axios";

// function ChatApp() {
//   const [showNotification, setShowNotification] = useState(true);
//   const [activeContact, setActiveContact] = useState(null);
//   const [showEditProfile, setShowEditProfile] = useState(false);
//   const [activeSidebar, setActiveSidebar] = useState("chat");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   // const [userData, setUserData] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     // fetch();
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsAuthenticated(true);
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   const handleSelectContact = (contact) => {
//     setActiveContact(contact);
//   };

//   const handleEditProfile = () => {
//     setShowEditProfile(true);
//   };

//   const handleCloseEditProfile = () => {
//     setShowEditProfile(false);
//   };

//   const toggleSidebar = (sidebarType) => {
//     setActiveSidebar(sidebarType);
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
//   // const fetch = async () => {
//   //   const url = "https://chat-app-demo-9e8a.onrender.com/users";
//   //   const response = await axios.get(url);
//   //   console.log("userData", response.data);
//   //   setUserData([...userData, response.data]);
//   // };

//   if (!isAuthenticated) {
//     return <Login />;
//   }

//   return (
//     <div className="flex flex-col h-screen bg-#E0F2F1">
//       {/* userData */}
//       <Header
//         onEditProfile={handleEditProfile}
//         onToggleSidebar={toggleSidebar}
//         activeSidebar={activeSidebar}
//         onLogout={handleLogout}
//       />
//       <div className="flex flex-1 overflow-hidden">
//         {showEditProfile ? (
//           <EditProfile onClose={handleCloseEditProfile} />
//         ) : (
//           <>
//             {activeSidebar === "chat" ? (
//               <Sidebar
//                 onSelectContact={handleSelectContact}
//                 activeContactId={activeContact?.id}
//               />
//             ) : (
//               <ContactsSidebar
//                 onSelectContact={handleSelectContact}
//                 activeContactId={activeContact?.id}
//               />
//             )}
//             <ChatArea activeContact={activeContact} />
//           </>
//         )}
//       </div>
//       {showNotification && (
//         <UpdateNotification onDismiss={() => setShowNotification(false)} />
//       )}
//     </div>
//   );
// }

// export default ChatApp;

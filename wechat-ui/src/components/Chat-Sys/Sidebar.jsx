import { useState, useEffect, useRef } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import AddFriend from "./AddFriend";
import { ChatIcon } from "./Icons";

function Sidebar({ onSelectUser, activeUserId, users, currentUserId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [blankError, setBlankError] = useState("");
  const sidebarRef = useRef(null);

  useEffect(() => {
    setFilteredUsers([]);
    setSearchError("");
    setBlankError("");

    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleContextMenu = (event, userId) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
    setSelectedUserId(userId);
  };

  const handleContextMenuClose = () => setContextMenu(null);

  const toggleArchive = (userId) => {
    const userIndex = users.findIndex((u) => u._id === userId);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      const [archivedUser] = updatedUsers.splice(userIndex, 1);
      setArchivedUsers([...archivedUsers, archivedUser]);
    } else {
      const archivedIndex = archivedUsers.findIndex((u) => u._id === userId);
      if (archivedIndex !== -1) {
        const updatedArchived = [...archivedUsers];
        const [unarchivedUser] = updatedArchived.splice(archivedIndex, 1);
        setArchivedUsers(updatedArchived);
        users.push(unarchivedUser);
      }
    }
    handleContextMenuClose();
  };

  const togglePin = (userId) => {
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, isPinned: !user.isPinned } : user
    );
    setFilteredUsers(updatedUsers);
    handleContextMenuClose();
  };

  const handleAddFriendClick = () => setIsAddFriendDialogOpen(true);
  const handleAddFriendDialogClose = () => setIsAddFriendDialogOpen(false);
  const handleAddFriend = (newFriend) => {
    // Implement add friend logic here
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserClick = (userId) => {
    onSelectUser(userId);
    setIsSidebarOpen(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const searchParts = searchTerm.trim().split(" ");
      if (searchParts.length === 2) {
        const filtered = (showArchived ? archivedUsers : users)
          .filter((user) => user._id !== currentUserId)
          .filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            return (
              fullName.includes(searchParts[0].toLowerCase()) &&
              fullName.includes(searchParts[1].toLowerCase())
            );
          })
          .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

        setFilteredUsers(filtered);
        setSearchError("");
        setBlankError("");
      } else {
        setFilteredUsers([]);
        setSearchError("Please enter both first and last names.");
        setBlankError("");
      }
    } else if (searchTerm.trim() === "") {
      setBlankError(
        "Enter correct first and last name of user to connect with. Also, add a space between their first and last name."
      );
    }
  };

  return (
    <div>
      {!isSidebarOpen && (
        <button
          className="lg:hidden fixed top-5 left-36 z-20 text-[#00796B] bg-[#E0F2F1]
 p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <ChatIcon />
        </button>
      )}

      <div
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 w-80 bg-white border-r overflow-y-auto h-screen z-10 transition-transform transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Chats</h2>
            <div className="flex space-x-2">
              <button
                className="text-gray-500 hover:bg-blue-50 rounded-full p-1"
                onClick={handleAddFriendClick}
              >
                <AddIcon fontSize="small" />
              </button>
              <button
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                onClick={handleFilterClick}
              >
                <FilterListIcon fontSize="small" />
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search users (first and last name)"
              className="w-full p-2 pl-8 bg-gray-100 rounded-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchIcon
              className="absolute left-2 top-2.5 text-gray-400"
              fontSize="small"
            />
          </div>

          {filteredUsers.length === 0 && searchTerm.trim() === "" && (
            <h2 className="text-xl font-bold text-green-200 py-20">
              Search First And Last Name Of User To Start Chatting With Them.
              Also, Don't Forget To Add Space Between First And Last Name.
            </h2>
          )}

          {searchError && (
            <p className="text-red-500 text-sm mt-2">{searchError}</p>
          )}
          {blankError && (
            <p className="text-red-500 text-sm mt-2">{blankError}</p>
          )}
        </div>

        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                activeUserId === user._id ? "bg-gray-100" : ""
              } ${user.isPinned ? "border-l-4 border-blue-500" : ""}`}
              onClick={() => handleUserClick(user._id)}
              onContextMenu={(e) => handleContextMenu(e, user._id)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={`https://chat-app-demo-9e8a.onrender.com/${user.avatar}`}
                      alt={user.firstName}
                    />
                  ) : (
                    <span className="text-xl text-gray-600">
                      {user.firstName[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              setShowArchived(false);
              handleClose();
            }}
          >
            All Users
          </MenuItem>
          <MenuItem
            onClick={() => {
              setShowArchived(true);
              handleClose();
            }}
          >
            Archived Users
          </MenuItem>
        </Menu>

        <AddFriend
          open={isAddFriendDialogOpen}
          onClose={handleAddFriendDialogClose}
          onAddFriend={handleAddFriend}
        />
      </div>
    </div>
  );
}

export default Sidebar;

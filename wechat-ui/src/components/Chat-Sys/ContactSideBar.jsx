import React, { useState } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const contacts = [
  {
    id: 1,
    name: "Meenakshi Bhushan",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "K2K Group",
    avatar: "https://i.pravatar.cc/150?img=2",
    isGroup: true,
  },
  { id: 3, name: "Akshita Pandey", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Ravi Kumar", avatar: "https://i.pravatar.cc/150?img=4" },
  {
    id: 5,
    name: "Subh Kumar Singh",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  { id: 6, name: "Mukesh Tyagi", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "Sneha Singhal", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "Jay Tyagi", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 9, name: "Priya Raj", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 10, name: "Anupam Raj", avatar: "https://i.pravatar.cc/150?img=10" },
];

function ContactSideBar({ onSelectContact, activeContactId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r overflow-y-auto h-screen">
      <div className="p-4 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Contacts</h2>
          <span className="text-sm text-gray-500">
            {contacts.length} Contacts
          </span>
        </div>
        <div className="flex space-x-2 mb-4">
          <button className="px-3 py-1 text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
            + New
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center">
            <FilterListIcon fontSize="small" className="mr-1" /> Filter
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          {["All", "New", "Favorites", "Blocked"].map((tab) => (
            <button
              key={tab}
              className={`text-sm ${
                activeTab === tab.toLowerCase()
                  ? "text-teal-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contact / chat"
            className="w-full p-2 pl-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ul>
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
              activeContactId === contact.id ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="flex items-center">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                {contact.isGroup && (
                  <p className="text-sm text-gray-500">Group</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactSideBar;

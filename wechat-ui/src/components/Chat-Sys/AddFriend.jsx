import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const AddFriend = ({ open, onClose, users, onAddFriend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [noResultMessage, setNoResultMessage] = useState("");

  const handleSearch = () => {
    
    const searchParts = searchTerm.trim().split(" ");
    
    
    if (searchParts.length === 2) {
      const filtered = users.filter((user) =>
        user.firstName.toLowerCase() === searchParts[0].toLowerCase() &&
        user.lastName.toLowerCase() === searchParts[1].toLowerCase()
      );

      if (filtered.length === 0) {
        setNoResultMessage("Please provide correct first name and last name.");
      } else {
        setNoResultMessage(""); 
      }

      setFilteredContacts(filtered);
    } else {
      setFilteredContacts([]);
      setNoResultMessage("Please provide correct first name and last name.");
    }
  };

  const handleAddFriend = (contact) => {
    onAddFriend(contact);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Friend</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="search"
          label="Search contacts"
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginTop: '10px' }} 
        >
          Search
        </Button>
        <List>
          {filteredContacts.map((contact) => (
            <ListItem
              key={contact._id}
              button
              onClick={() => handleAddFriend(contact)}
            >
              <ListItemAvatar>
                <Avatar src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} />
              </ListItemAvatar>
              <ListItemText primary={`${contact.firstName} ${contact.lastName}`} />
              <Button variant="outlined" style={{ color: "#26A69A" }}>
                Add
              </Button>
            </ListItem>
          ))}
        </List>
        
        {noResultMessage && (
          <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
            {noResultMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: "#26A69A" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriend;

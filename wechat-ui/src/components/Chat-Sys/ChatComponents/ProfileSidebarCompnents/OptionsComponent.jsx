// import React from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import {
//   ArrowBack as ArrowBackIcon,
//   ChevronRight as ChevronRightIcon,
// } from "@mui/icons-material";

// const OptionsComponent = ({ onBack }) => {
//   const options = [
//     { title: "Chat Themes", items: 5 },
//     { title: "Chat Background", items: 4 },
//   ];

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <IconButton onClick={onBack} sx={{ mr: 1 }}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h6">Options</Typography>
//       </Box>
//       <Typography variant="subtitle2" sx={{ mb: 1 }}>
//         Customization
//       </Typography>
//       <List>
//         {options.map((option, index) => (
//           <React.Fragment key={option.title}>
//             <ListItem
//               secondaryAction={
//                 <IconButton edge="end">
//                   <ChevronRightIcon />
//                 </IconButton>
//               }
//             >
//               <ListItemText
//                 primary={option.title}
//                 secondary={
//                   <Box sx={{ display: "flex", mt: 1 }}>
//                     {Array(option.items)
//                       .fill(null)
//                       .map((_, i) => (
//                         <Box
//                           key={i}
//                           sx={{
//                             width: 24,
//                             height: 24,
//                             backgroundColor: "#E0E0E0",
//                             borderRadius: 1,
//                             mr: 1,
//                           }}
//                         />
//                       ))}
//                   </Box>
//                 }
//               />
//             </ListItem>
//             {index < options.length - 1 && <Divider />}
//           </React.Fragment>
//         ))}
//       </List>
//       <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
//         Manage
//       </Typography>
//     </Box>
//   );
// };

// export default OptionsComponent;

import React, { useState } from "react";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ChevronRight as ChevronRightIcon,
  Block as BlockIcon,
  Report as ReportIcon,
} from "@mui/icons-material";

const OptionsComponent = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState("customization");

  const customizationOptions = [
    { title: "Chat Themes", items: 5 },
    { title: "Chat Background", items: 4 },
  ];

  const manageOptions = [
    {
      title: "Block",
      icon: <BlockIcon />,
      description: "You will no longer be in your contact",
    },
    {
      title: "Report",
      icon: <ReportIcon />,
      description: "Give feedback on this conversation",
    },
  ];

  const buttonStyle = (isActive) => ({
    backgroundColor: isActive ? "#26A69A" : "white",
    color: "gray",
    "&:hover": {
      backgroundColor: isActive ? "#26A69A" : "white",
    },
    borderColor: "gray",
    borderRadius: "20px",
    textTransform: "none",
    flex: 1,
  });

  const renderCustomization = () => (
    <>
      <Typography variant="subtitle2" sx={{ mb: 1, color: "gray" }}>
        Customization
      </Typography>
      <List>
        {customizationOptions.map((option, index) => (
          <React.Fragment key={option.title}>
            <ListItem
              secondaryAction={
                <IconButton edge="end">
                  <ChevronRightIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={<Typography color="gray">{option.title}</Typography>}
                secondary={
                  <Box sx={{ display: "flex", mt: 1 }}>
                    {Array(option.items)
                      .fill(null)
                      .map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: "#E0E0E0",
                            borderRadius: 1,
                            mr: 1,
                          }}
                        />
                      ))}
                  </Box>
                }
              />
            </ListItem>
            {index < customizationOptions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  const renderManage = () => (
    <>
      <Typography variant="subtitle2" sx={{ mb: 1, color: "gray" }}>
        Manage
      </Typography>
      <List>
        {manageOptions.map((option, index) => (
          <React.Fragment key={option.title}>
            <ListItem>
              <ListItemIcon sx={{ color: "gray" }}>{option.icon}</ListItemIcon>
              <ListItemText
                primary={<Typography color="gray">{option.title}</Typography>}
                secondary={
                  <Typography color="gray" variant="body2">
                    {option.description}
                  </Typography>
                }
              />
            </ListItem>
            {index < manageOptions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1, color: "gray" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" color="gray">
          Options
        </Typography>
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setActiveSection("customization")}
          sx={{ ...buttonStyle(activeSection === "customization"), mr: 1 }}
        >
          Customization
        </Button>
        <Button
          variant="outlined"
          onClick={() => setActiveSection("manage")}
          sx={buttonStyle(activeSection === "manage")}
        >
          Manage
        </Button>
      </Box>
      {activeSection === "customization"
        ? renderCustomization()
        : renderManage()}
    </Box>
  );
};

export default OptionsComponent;

import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { AttachFile as AttachFileIcon } from "@mui/icons-material";

const MediaComponent = ({ onBack }) => {
  const mediaItems = Array(4).fill(null);
  const [documents] = useState([
    { name: "Resume.pdf", size: "2.3 MB" },
    { name: "Project_Proposal.docx", size: "1.5 MB" },
    { name: "Meeting_Notes.txt", size: "0.5 MB" },
    { name: "Presentation.pptx", size: "4.2 MB" },
    { name: "Budget.xlsx", size: "1.8 MB" },
    { name: "Report.pdf", size: "3.1 MB" },
  ]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
          Media
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {mediaItems.map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box
              sx={{
                width: "100%",
                paddingTop: "100%",
                backgroundColor: "#E0E0E0",
                borderRadius: 1,
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, mt: 2, mb: 1 }}>
        Documents
      </Typography>
      
      <List>
        {documents.map((doc, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <AttachFileIcon />
            </ListItemIcon>
            <ListItemText
              primary={doc.name}
              secondary={doc.size}
              primaryTypographyProps={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              secondaryTypographyProps={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MediaComponent;

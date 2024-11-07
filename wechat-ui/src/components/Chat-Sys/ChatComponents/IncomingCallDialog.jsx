import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
} from "@mui/icons-material";

const IncomingCallDialog = ({ open, caller, onAccept, onReject }) => {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#E0F2F1",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <Typography variant="h6" sx={{ color: "#26A69A" }}>
          Incoming Call
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
          }}
        >
          <Avatar
            src={caller?.avatar}
            alt={caller?.firstName}
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: "#26A69A",
            }}
          >
            {caller?.firstName?.[0]}
          </Avatar>

          <Typography variant="h6" sx={{ mb: 1 }}>
            {`${caller?.firstName} ${caller?.lastName}`}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PhoneIcon fontSize="small" />
            Audio Call
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={onReject}
          startIcon={<CallEndIcon />}
          sx={{
            borderRadius: 28,
            px: 3,
          }}
        >
          Decline
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onAccept}
          startIcon={<CallIcon />}
          sx={{
            borderRadius: 28,
            px: 3,
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomingCallDialog;

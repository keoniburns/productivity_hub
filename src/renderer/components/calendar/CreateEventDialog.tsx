import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { format } from "date-fns";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onClose,
  selectedDate,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField label="Event Title" fullWidth variant="outlined" />
          <TextField
            label="Date"
            fullWidth
            variant="outlined"
            value={selectedDate ? format(selectedDate, "PPP") : ""}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Time"
            fullWidth
            variant="outlined"
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onClose}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

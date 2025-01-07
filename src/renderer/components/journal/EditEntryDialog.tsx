import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { JournalEntry } from "./types";

interface EditEntryDialogProps {
  open: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
}

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#e0e0e0",
    borderRadius: 8,
    "& fieldset": { borderColor: "#333333" },
    "&:hover fieldset": { borderColor: "#c0965c" },
    "&.Mui-focused fieldset": {
      borderColor: "#c0965c",
      borderWidth: "2px",
    },
  },
};

const selectStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#e0e0e0",
    borderRadius: 8,
    "& fieldset": { borderColor: "#333333" },
    "&:hover fieldset": { borderColor: "#c0965c" },
    "&.Mui-focused fieldset": {
      borderColor: "#c0965c",
      borderWidth: "2px",
    },
  },
  "& .MuiSelect-icon": {
    color: "#808080",
  },
  "& .MuiMenu-paper": {
    backgroundColor: "#212121",
    color: "#e0e0e0",
  },
  "& .MuiMenuItem-root": {
    "&:hover": {
      backgroundColor: "rgba(192, 150, 92, 0.1)",
    },
  },
};

export const EditEntryDialog = ({
  open,
  entry,
  onClose,
  onSave,
}: EditEntryDialogProps) => {
  const [editedEntry, setEditedEntry] = useState<JournalEntry>(
    entry || {
      title: "",
      content: "",
      mood: "Neutral",
      tags: [],
    }
  );

  useEffect(() => {
    if (entry) setEditedEntry(entry);
  }, [entry]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#212121",
          borderRadius: "12px",
          minWidth: "600px",
          maxWidth: "800px",
        },
      }}
    >
      <DialogTitle sx={{ color: "#e0e0e0" }}>Edit Entry</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            value={editedEntry.title}
            onChange={(e) =>
              setEditedEntry({ ...editedEntry, title: e.target.value })
            }
            sx={textFieldStyles}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            value={editedEntry.content}
            onChange={(e) =>
              setEditedEntry({ ...editedEntry, content: e.target.value })
            }
            sx={textFieldStyles}
          />
          <FormControl fullWidth>
            <Select
              value={editedEntry.mood}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, mood: e.target.value })
              }
              sx={selectStyles}
            >
              {["Happy", "Peaceful", "Neutral", "Anxious", "Sad"].map(
                (mood) => (
                  <MenuItem key={mood} value={mood}>
                    {mood}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#808080" }}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(editedEntry)}
          variant="contained"
          sx={{ bgcolor: "#c0965c", "&:hover": { bgcolor: "#c0965c" } }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

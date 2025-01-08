import React, { useState } from "react";
import { Stack, Button, Typography } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface NewEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
}

interface JournalEntry {
  title: string;
  content: string;
  mood: string;
  tags: string[];
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
    borderRadius: 8,
  },
  "& .MuiMenu-paper": {
    backgroundColor: "#212121",
    color: "#e0e0e0",
  },
  "& .MuiMenuItem-root": {
    "&:hover": {
      backgroundColor: "rgba(192, 150, 92, 0.1)",
      borderColor: "#c0965c",
    },
  },
};

const prompts = [
  "What's a challenge you're currently facing?",
  "What are you grateful for today?",
  "What's something you'd like to achieve this month?",
  "Describe your ideal day.",
  "What's a recent lesson you've learned?",
  "What are 5 things you are grateful for?",
  "What are 5 things you are proud of?",
];

export const NewEntryDialog = ({
  open,
  onClose,
  onSave,
}: NewEntryDialogProps) => {
  const [entry, setEntry] = useState<JournalEntry>({
    title: "",
    content: "",
    mood: "Neutral",
    tags: [],
  });
  const [showPromptDialog, setShowPromptDialog] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  const handleClose = () => {
    setEntry({ title: "", content: "", mood: "Neutral", tags: [] });
    setShowPromptDialog(true);
    setSelectedPrompt("");
    onClose();
  };

  const handlePromptSelect = (prompt: string | null) => {
    setShowPromptDialog(false);
    if (prompt) {
      setSelectedPrompt(prompt);
      setEntry({ ...entry, content: `Prompt: ${prompt}\n\n` });
    }
  };

  if (showPromptDialog) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#e0e0e0" }}>
          Choose Writing Style
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handlePromptSelect(null)}
              sx={{
                color: "#c0965c",
                borderColor: "#333333",
                "&:hover": { borderColor: "#c0965c" },
                borderRadius: 10,
              }}
            >
              Free Writing
            </Button>
            <Typography sx={{ color: "#808080", mt: 1 }}>
              Or choose a prompt:
            </Typography>
            {prompts.map((prompt) => (
              <Button
                key={prompt}
                fullWidth
                variant="outlined"
                onClick={() => handlePromptSelect(prompt)}
                sx={{
                  color: "#c0965c",
                  borderColor: "#333333",
                  "&:hover": { borderColor: "#c0965c" },
                  textAlign: "left",
                  justifyContent: "flex-start",
                  borderRadius: 10,
                }}
              >
                {prompt}
              </Button>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSave = () => {
    onSave(entry);
    setEntry({ title: "", content: "", mood: "Neutral", tags: [] });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          minWidth: "600px",
          maxWidth: "800px",
        },
      }}
    >
      <DialogTitle sx={{ color: "#e0e0e0" }}>New Journal Entry</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Title"
            value={entry.title}
            onChange={(e) => setEntry({ ...entry, title: e.target.value })}
            sx={textFieldStyles}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="What's on your mind?"
            value={entry.content}
            onChange={(e) => setEntry({ ...entry, content: e.target.value })}
            sx={textFieldStyles}
          />
          <FormControl fullWidth>
            <Select
              value={entry.mood}
              onChange={(e) =>
                setEntry({ ...entry, mood: e.target.value as string })
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
        <Button onClick={handleClose} sx={{ color: "#808080" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#c0965c",
            "&:hover": { bgcolor: "#a17c4a" },
          }}
        >
          Save Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

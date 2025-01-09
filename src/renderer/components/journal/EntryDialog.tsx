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
  Typography,
  Box,
} from "@mui/material";
import { JournalEntry, MOOD_COLORS } from "./types";

interface EntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  entry?: JournalEntry | null; // Optional for edit mode
  isEdit?: boolean;
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
};

const getWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

export const EntryDialog = ({
  open,
  onClose,
  onSave,
  entry: initialEntry,
  isEdit = false,
}: EntryDialogProps) => {
  const [entry, setEntry] = useState<JournalEntry>({
    title: "",
    content: "",
    mood: "Neutral",
    tags: [],
  });
  const [showPromptDialog, setShowPromptDialog] = useState(!isEdit);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  useEffect(() => {
    if (isEdit && initialEntry) {
      setEntry(initialEntry);
    }
  }, [isEdit, initialEntry]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(entry);
    onClose();
  };

  const handleExited = () => {
    setEntry({ title: "", content: "", mood: "Neutral", tags: [] });
    setShowPromptDialog(!isEdit);
    setSelectedPrompt("");
  };

  const handlePromptSelect = (prompt: string | null) => {
    setShowPromptDialog(false);
    if (prompt) {
      setSelectedPrompt(prompt);
      setEntry({ ...entry, title: prompt });
    }
  };

  if (showPromptDialog && !isEdit) {
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionProps={{
        onExited: handleExited,
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          minWidth: "600px",
          maxWidth: "800px",
        },
      }}
    >
      <DialogTitle sx={{ color: "#e0e0e0" }}>
        {isEdit ? "Edit Entry" : "New Journal Entry"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {!selectedPrompt && (
            <TextField
              fullWidth
              placeholder="Title"
              value={entry.title}
              onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              sx={textFieldStyles}
            />
          )}
          {selectedPrompt && !isEdit && (
            <Typography sx={{ color: "#e0e0e0" }}>{selectedPrompt}</Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="What's on your mind?"
            value={entry.content}
            onChange={(e) => setEntry({ ...entry, content: e.target.value })}
            sx={textFieldStyles}
          />
          <Typography variant="caption" sx={{ color: "#808080", ml: 1 }}>
            {getWordCount(entry.content)} words
          </Typography>
          <FormControl fullWidth>
            <Select
              value={entry.mood}
              onChange={(e) =>
                setEntry({ ...entry, mood: e.target.value as string })
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor:
                        MOOD_COLORS[selected as keyof typeof MOOD_COLORS],
                      flexShrink: 0,
                    }}
                  />
                  {selected}
                </Box>
              )}
              sx={selectStyles}
            >
              {Object.keys(MOOD_COLORS).map((mood) => (
                <MenuItem
                  key={mood}
                  value={mood}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: MOOD_COLORS[mood as keyof typeof MOOD_COLORS],
                      flexShrink: 0,
                    }}
                  />
                  {mood}
                </MenuItem>
              ))}
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
          {isEdit ? "Save Changes" : "Save Entry"}
        </Button>
      </DialogActions>
    </Dialog>
  );
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

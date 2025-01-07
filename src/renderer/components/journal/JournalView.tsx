import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  styled,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ReactMarkdown from "react-markdown";
import { JournalSidebar } from "./JournalSidebar";
import { EntryCard } from "./EntryCard";
import { NewEntryDialog } from "./NewEntryDialog";
import { JournalEntry } from "./types";
import { EditEntryDialog } from "./EditEntryDialog";

const JournalContainer = styled(Box)(() => ({
  display: "flex",
  gap: "24px",
  padding: "24px",
  height: "100%",
  backgroundColor: "#1a1a1a",
}));

const EntryImage = styled("img")(() => ({
  width: "100%",
  height: "200px",
  objectFit: "cover",
}));

const EntryContent = styled(Box)(() => ({
  padding: "16px",
}));

const EntryMeta = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#808080",
  fontSize: "0.875rem",
  marginTop: "8px",
}));

const prompts = [
  "What's a challenge you're currently facing?",
  "What are you grateful for today?",
  "What's something you'd like to achieve this month?",
  "Describe your ideal day.",
  "What's a recent lesson you've learned?",
];

// Common TextField styles
const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#e0e0e0",
    borderRadius: 8,
    transition: "all 0.2s",
    "& fieldset": {
      borderColor: "#333333",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#c0965c",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#c0965c",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
  },
};

// Update IconButton styles
const iconButtonStyle = {
  color: "#c0965c",
  transition: "all 0.2s",
  "&:hover": {
    color: "#e0e0e0",
    backgroundColor: "rgba(192, 150, 92, 0.15)",
  },
};

export const JournalView = () => {
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState("All Entries");

  const handleSaveEntry = (entry: JournalEntry) => {
    setEntries([...entries, { ...entry, id: Date.now() }]);
    setIsNewEntryOpen(false);
  };

  const handleEditEntry = (updatedEntry: JournalEntry) => {
    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setEditEntry(null);
  };

  return (
    <Box
      sx={{ display: "flex", gap: 3, p: 3, height: "100%", bgcolor: "#1a1a1a" }}
    >
      <JournalSidebar
        onNewEntry={() => setIsNewEntryOpen(true)}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      <Box sx={{ flex: 1 }}>
        <Grid container spacing={3}>
          {entries.map((entry) => (
            <Grid item xs={12} sm={6} key={entry.id}>
              <EntryCard
                title={entry.title}
                preview={entry.content}
                date={new Date().toLocaleDateString()}
                mood={entry.mood}
                onClick={() => console.log("View entry:", entry.id)}
                onDoubleClick={() => setEditEntry(entry)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <NewEntryDialog
        open={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        onSave={handleSaveEntry}
      />

      <EditEntryDialog
        open={!!editEntry}
        entry={editEntry}
        onClose={() => setEditEntry(null)}
        onSave={handleEditEntry}
      />
    </Box>
  );
};

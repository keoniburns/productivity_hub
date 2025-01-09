import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { JournalSidebar } from "./JournalSidebar";
import { EntryCard } from "./EntryCard";
import { EntryDialog } from "./EntryDialog";
import { JournalEntry } from "./types";

export const JournalView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState("All Entries");

  const handleSaveEntry = (entry: JournalEntry) => {
    if (editEntry) {
      setEntries(
        entries.map((e) =>
          e.id === editEntry.id ? { ...entry, id: editEntry.id } : e
        )
      );
      setEditEntry(null);
    } else {
      setEntries([...entries, { ...entry, id: Date.now() }]);
    }
    setIsDialogOpen(false);
  };

  const handleOpenEdit = (entry: JournalEntry) => {
    setEditEntry(entry);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditEntry(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        p: 3,
        height: "100%",
        bgcolor: "#1a1a1a",
        overflow: "hidden",
      }}
    >
      <JournalSidebar
        onNewEntry={() => setIsDialogOpen(true)}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      <Box sx={{ flex: 1, overflow: "auto", pr: 2 }}>
        <Grid container spacing={3}>
          {entries.map((entry) => (
            <Grid item xs={12} md={6} key={entry.id}>
              <EntryCard
                title={entry.title}
                preview={entry.content}
                date={new Date().toLocaleDateString()}
                mood={entry.mood}
                onClick={() => console.log("View entry:", entry.id)}
                onDoubleClick={() => handleOpenEdit(entry)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {isDialogOpen && (
        <EntryDialog
          open={isDialogOpen}
          onClose={handleClose}
          onSave={handleSaveEntry}
          entry={editEntry}
          isEdit={!!editEntry}
        />
      )}
    </Box>
  );
};

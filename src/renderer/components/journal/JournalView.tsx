import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { JournalSidebar } from "./JournalSidebar";
import { EntryCard } from "./EntryCard";
import { NewEntryDialog } from "./NewEntryDialog";
import { JournalEntry } from "./types";
import { EditEntryDialog } from "./EditEntryDialog";

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

import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface JournalSidebarProps {
  onNewEntry: () => void;
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export const JournalSidebar = ({
  onNewEntry,
  selectedTab,
  onTabChange,
}: JournalSidebarProps) => (
  <Box sx={{ width: 250 }}>
    <Typography variant="h5" sx={{ mb: 3, color: "#e0e0e0" }}>
      Journal
    </Typography>
    <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNewEntry}
        sx={{
          bgcolor: "#c0965c",
          "&:hover": { bgcolor: "#a17c4a" },
        }}
      >
        New Entry
      </Button>
    </Box>
    <Stack spacing={1}>
      {["All Entries", "This Week", "Favorites"].map((tab) => (
        <Button
          key={tab}
          onClick={() => onTabChange(tab)}
          sx={{
            justifyContent: "flex-start",
            color: selectedTab === tab ? "#c0965c" : "#808080",
            "&:hover": { color: "#c0965c" },
          }}
        >
          {tab}
        </Button>
      ))}
    </Stack>
  </Box>
);

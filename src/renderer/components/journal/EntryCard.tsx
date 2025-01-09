import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { MOOD_COLORS } from "./types";

interface EntryCardProps {
  title: string;
  preview: string;
  date: string;
  mood: string;
  onClick: () => void;
  onDoubleClick: () => void;
}

export const EntryCard = ({
  title,
  preview,
  date,
  mood,
  onClick,
  onDoubleClick,
}: EntryCardProps) => (
  <Paper
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    sx={{
      backgroundColor: "#212121",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "transform 0.2s",
      cursor: "pointer",
      width: "100%",
      minHeight: "180px",
      display: "flex",
      flexDirection: "column",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    }}
  >
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: "#e0e0e0" }}>
        {title}
      </Typography>
      <Typography sx={{ color: "#808080", mt: 1 }} noWrap>
        {preview}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          color: "#808080",
          fontSize: "0.875rem",
          mt: 2,
        }}
      >
        <Typography>{date}</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography>Mood: {mood}</Typography>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor:
                MOOD_COLORS[mood as keyof typeof MOOD_COLORS] || "#c0965c",
            }}
          />
        </Box>
      </Box>
    </Box>
  </Paper>
);

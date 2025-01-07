import React from "react";
import { Box, Typography, Button, styled, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const StyledHeader = styled(Box)(() => ({
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #333333",
  backgroundColor: "#212121",
}));

const TitleContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "200px", // Fixed width
  justifyContent: "center", // Center the content
}));

interface CalendarHeaderProps {
  title: string;
  onCreateEvent: () => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const CalendarHeader = ({
  title,
  onCreateEvent,
  onPreviousWeek,
  onNextWeek,
}: CalendarHeaderProps) => (
  <StyledHeader>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={onPreviousWeek}
        size="small"
        sx={{ color: "#c0965c" }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <TitleContainer>
        <Typography variant="h6">{title}</Typography>
      </TitleContainer>
      <IconButton
        onClick={onNextWeek}
        size="small"
        sx={{ display: "flex", alignItems: "center", color: "#c0965c" }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
    <Button
      variant="contained"
      onClick={onCreateEvent}
      sx={{
        bgcolor: "#c0965c", // Bronze/copper accent
        "&:hover": {
          bgcolor: "#a17c4a", // Darker bronze on hover
        },
      }}
    >
      CREATE EVENT
    </Button>
  </StyledHeader>
);

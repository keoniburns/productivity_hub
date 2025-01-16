import React from "react";
import { Box, styled } from "@mui/material";
import { format } from "date-fns";

const StyledTimeHeader = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(24, 120px)",
  backgroundColor: "#212121",
}));

const TimeLabel = styled(Box)(() => ({
  padding: "12px",
  color: "#808080",
  borderRight: "1px solid #333333",
  borderBottom: "1px solid #333333",
  minWidth: "10px",
  textAlign: "center",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const TimeHeader = () => (
  <StyledTimeHeader>
    {Array.from({ length: 24 }, (_, i) => (
      <TimeLabel key={i}>
        {format(new Date().setHours(i + 1, 0), "h:mm a")}
      </TimeLabel>
    ))}
  </StyledTimeHeader>
);

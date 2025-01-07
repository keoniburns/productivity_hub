import React from "react";
import { Box, Typography, styled } from "@mui/material";
import { format } from "date-fns";

const StyledDayRow = styled(Box)(() => ({
  display: "flex",
  height: "100px",
  borderBottom: "1px solid #333333",
}));

const DayLabel = styled(Box)(() => ({
  width: "100px",
  minWidth: "130px",
  height: "120px",
  padding: "12px",
  backgroundColor: "#212121",
  borderRight: "1px solid #333333",
  borderBottom: "1px solid #333333",
  color: "#808080",
  position: "sticky",
  left: 0,
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));

const TimeSlots = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(24, 120px)",
  width: "fit-content",
  borderRight: "1px solid #333333",
  backgroundColor: "#1a1a1a",
}));

const TimeSlot = styled(Box)(() => ({
  //   height: "60px",
  borderRight: "1px solid #333333",
  borderBottom: "1px solid #333333",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
}));

interface DayRowProps {
  date: Date;
}

export const DayRow = ({ date }: DayRowProps) => {
  const handleTimeSlotClick = (hour: number) => {
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour, 0, 0, 0);
    console.log("Clicked time slot:", selectedDateTime);
    // TODO: Handle time slot click (e.g., open event creation dialog)
  };

  return (
    <Box sx={{ display: "flex" }}>
      <DayLabel>
        {format(date, "EEE")} {format(date, "d")}
      </DayLabel>

      <TimeSlots>
        {Array.from({ length: 24 }, (_, i) => (
          <TimeSlot key={i} onClick={() => handleTimeSlotClick((i + 1) % 24)} />
        ))}
      </TimeSlots>
    </Box>
  );
};

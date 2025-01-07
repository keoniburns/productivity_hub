import React, { useState, useEffect } from "react";
import { Box, styled } from "@mui/material";
import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";
import { TimeHeader } from "./TimeHeader";
import { DayRow } from "./DayRow";
import { CalendarHeader } from "./CalendarHeader";

const TIMEZONE = {
  offset: -8,
  label: "GMT-8",
};

const CalendarContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "#1a1a1a",
  color: "#e0e0e0",
}));

const TimeGrid = styled(Box)(() => ({
  flex: 1,
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderTop: "none",
  "& > *": {
    borderTop: "none",
  },
}));

const CurrentTimeLine = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "2px",
  backgroundColor: "#c0965c",
  zIndex: 3,
  pointerEvents: "none",
}));

const GmtLabel = styled(Box)(() => ({
  width: "130px",

  minWidth: "130px",
  padding: "12px",
  backgroundColor: "#212121",
  borderRight: "1px solid #333333",
  borderBottom: "1px solid #24283b",
  color: "#808080",
  fontSize: "0.75rem",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  position: "sticky",
  left: 0,
  zIndex: 2,
  height: "40px",
  justifyContent: "flex-start",
}));

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTimeLeft, setCurrentTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimeIndicator = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Debug logs
      console.log("Raw time:", hours, ":", minutes);

      // Calculate based on 24-hour range starting at 1 AM
      const hoursSince1AM = (hours - 1 + 24) % 24;
      const percentage = ((hoursSince1AM * 60 + minutes) / (24 * 60)) * 100;

      console.log("Hours since 1AM:", hoursSince1AM);
      console.log("Percentage:", percentage);
      setCurrentTimeLeft(percentage);
    };

    updateTimeIndicator();
    const interval = setInterval(updateTimeIndicator, 60000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const isTodaySelected = isToday(selectedDate);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(selectedDate), i)
  );

  const handlePreviousWeek = () => {
    setSelectedDate((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate((prev) => addWeeks(prev, 1));
  };

  return (
    <CalendarContainer>
      <CalendarHeader
        title={format(selectedDate, "MMMM yyyy")}
        onCreateEvent={() => setDialogOpen(true)}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <TimeGrid>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              bgcolor: "#1a1b26",
              borderBottom: "1px solid #24283b",
              display: "flex",
              height: "40px",
              alignItems: "stretch",
              borderTop: "none",
            }}
          >
            <GmtLabel>
              <span>GMT-</span>
              <span>{Math.abs(TIMEZONE.offset)}</span>
            </GmtLabel>
            <Box sx={{ position: "relative", flex: 1 }}>
              <TimeHeader />
            </Box>
          </Box>
          {weekDays.map((day) => (
            <Box key={day.toISOString()} sx={{ position: "relative" }}>
              {isToday(day) && (
                <CurrentTimeLine
                  sx={{
                    marginLeft: `${currentTimeLeft}%`,
                  }}
                />
              )}
              <DayRow date={day} />
            </Box>
          ))}
        </Box>
      </TimeGrid>
    </CalendarContainer>
  );
};

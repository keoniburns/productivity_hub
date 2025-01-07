import React, { useState, useEffect, useRef } from "react";
import { Box, styled, Slider, Button, IconButton, Typography } from "@mui/material";
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
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const TIMEZONE = {
  offset: -8,
  label: "GMT-8",
};

const CalendarContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "#1a1a1a",
}));

const TimeGrid = styled(Box)(() => ({
  flex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  borderTop: "none",
  paddingBottom: "24px",
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

const ScrollContainer = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    height: "12px",
    backgroundColor: "#1a1a1a",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c0965c",
    borderRadius: "6px",
    "&:hover": {
      backgroundColor: "#a17c4a",
    },
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#333333",
    borderRadius: "6px",
  },
}));

const ScrollBar = styled(Box)(() => ({
  height: "24px",
  padding: "2px 0",
  backgroundColor: "#1a1a1a",
  display: "flex",
  alignItems: "center",
  width: "200px",
}));

const CustomSlider = styled(Slider)(() => ({
  color: "#c0965c",
  '& .MuiSlider-thumb': {
    backgroundColor: "#c0965c",
    height: 16,
    width: 16,
    '&:hover': {
      backgroundColor: "#a17c4a",
    },
  },
  '& .MuiSlider-track': {
    backgroundColor: "#c0965c",
    height: 4,
  },
  '& .MuiSlider-rail': {
    backgroundColor: "#333333",
    height: 4,
  },
}));

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTimeLeft, setCurrentTimeLeft] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const timeGridRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (event: Event) => {
    const element = event.target as HTMLDivElement;
    const maxScroll = element.scrollWidth - element.clientWidth;
    setScrollPosition((element.scrollLeft / maxScroll) * 100);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (timeGridRef.current) {
      const maxScroll = timeGridRef.current.scrollWidth - timeGridRef.current.clientWidth;
      timeGridRef.current.scrollLeft = (maxScroll * (newValue as number)) / 100;
    }
  };

  return (
    <CalendarContainer>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        gap: 3
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handlePreviousWeek} sx={{ color: "#c0965c" }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ color: "#c0965c" }}>
            {format(selectedDate, "MMMM yyyy")}
          </Typography>
          <IconButton onClick={handleNextWeek} sx={{ color: "#c0965c" }}>
            <ChevronRight />
          </IconButton>
          <ScrollBar>
            <CustomSlider
              value={scrollPosition}
              onChange={handleSliderChange}
              aria-label="Calendar scroll"
              size="small"
            />
          </ScrollBar>
        </Box>



        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          Create Event
        </Button>
      </Box>

      <TimeGrid>
        <Box
          ref={timeGridRef}
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            position: "relative",
            height: "calc(100% - 24px)",
          }}
          onScroll={handleScroll}
        >
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
                <Box
                  data-time={day.toISOString()}
                  sx={{
                    position: "relative",
                  }}
                >
                  <DayRow date={day} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </TimeGrid>
    </CalendarContainer>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { Box, styled, Slider } from "@mui/material";
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

// import { ChevronLeft, ChevronRight } from "@mui/icons-material";

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

const TimeIndicator = styled(Box)(() => ({
  position: "absolute",
  top: "-20px",
  padding: "2px 6px",
  backgroundColor: "#c0965c",
  color: "#1a1a1a",
  fontSize: "0.75rem",
  borderRadius: "3px",
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
  zIndex: 4,
}));

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
}

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const timeGridRef = useRef<HTMLDivElement>(null);
  // const [adjustedHours, setAdjustedHours] = useState(0);
  // const [adjustedMinutes, setAdjustedMinutes] = useState(0);
  const [currentTime, setCurrentTime] = useState({ hours: 0, minutes: 0 });
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const updateTimeIndicator = () => {
      const now = new Date();

      const hoursUTC = now.getUTCHours();
      const minutesUTC = now.getUTCMinutes();

      const adjustedHours = (hoursUTC + TIMEZONE.offset + 24) % 24;
      const adjustedMinutes = minutesUTC;

      const BLOCK_WIDTH = 120;

      const position =
        adjustedHours * BLOCK_WIDTH + (adjustedMinutes / 60) * BLOCK_WIDTH;

      console.log("UTC Hours:", hoursUTC);
      console.log("Adjusted Hours:", adjustedHours);
      console.log("Position in px:", position);
      // setAdjustedHours(adjustedHours - 12);
      // setAdjustedMinutes(adjustedMinutes);
      setCurrentTime({ hours: adjustedHours - 12, minutes: adjustedMinutes });

      setCurrentTimePosition(position);
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

  const handleSliderChange = (
    _event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ) => {
    if (timeGridRef.current) {
      const maxScroll =
        timeGridRef.current.scrollWidth - timeGridRef.current.clientWidth;
      timeGridRef.current.scrollLeft = (maxScroll * (newValue as number)) / 100;
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      // Reset any ongoing drag operations in child components
      const event = new MouseEvent("mouseup");
      document.dispatchEvent(event);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleOpenDialog = (date: Date) => {
    setSelectedDateTime(date);
    setDialogOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedDate(new Date());
    setDialogOpen(true);
  };

  const handleEventCreate = (newEvent: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  useEffect(() => {
    const element = timeGridRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <CalendarContainer>
      <CalendarHeader
        title={format(selectedDate, "MMMM yyyy")}
        onCreateEvent={handleCreateEvent}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        scrollPosition={scrollPosition}
        onScroll={handleSliderChange}
      />

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
                <span>{TIMEZONE.label}</span>
              </GmtLabel>
              <Box sx={{ position: "relative", flex: 1 }}>
                <TimeHeader />
              </Box>
            </Box>
            {weekDays.map((day) => (
              <Box key={day.toISOString()} sx={{ position: "relative" }}>
                {isToday(day) && (
                  <>
                    <TimeIndicator
                      sx={{
                        left: `${currentTimePosition}px`,
                      }}
                    >
                      {`${String(currentTime.hours).padStart(2, "0")}:${String(
                        currentTime.minutes
                      ).padStart(2, "0")}`}
                    </TimeIndicator>
                    <CurrentTimeLine
                      sx={{
                        left: `${currentTimePosition}px`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </>
                )}
                <Box
                  data-time={day.toISOString()}
                  sx={{
                    position: "relative",
                    width: "2880px",
                  }}
                >
                  <DayRow
                    date={day}
                    events={events}
                    onEventCreate={handleEventCreate}
                    onEventUpdate={handleEventUpdate}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </TimeGrid>
    </CalendarContainer>
  );
};

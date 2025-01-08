import React, { useState, useRef, DragEvent } from "react";
import {
  Box,
  Typography,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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

interface DragState {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  isDragging: boolean;
}

const TimeSlot = styled(Box)(() => ({
  height: "120px",
  borderRight: "1px solid #333333",
  borderBottom: "1px solid #333333",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
}));

const DragSelection = styled(Box)(() => ({
  position: "absolute",
  backgroundColor: "rgba(192, 150, 92, 0.3)",
  border: "2px solid #c0965c",
  borderRadius: "4px",
  zIndex: 2,
  height: "calc(120px - 20px)",
  margin: "5px",
  pointerEvents: "none",
}));

interface DayRowProps {
  date: Date;
  events: CalendarEvent[];
  onEventCreate: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
}

interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
}

const EventBlock = styled(Box)(() => ({
  position: "absolute",
  backgroundColor: "rgba(192, 150, 92, 0.3)",
  border: "2px solid #c0965c",
  borderRadius: "4px",
  zIndex: 2,
  height: "calc(120px - 20px)",
  margin: "5px",
  padding: "8px",
  overflow: "hidden",
  color: "#fff",
  fontSize: "12px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(192, 150, 92, 0.4)",
  },
}));

export const DayRow = ({
  date,
  events,
  onEventCreate,
  onEventUpdate,
}: DayRowProps) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const timeGridRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    date: date,
  });
  const [tempEventId, setTempEventId] = useState<string | null>(null);
  const [tempEvent, setTempEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const calculateSelectionStyle = () => {
    if (!dragState) return null;

    const slotWidth = 120;
    const quarterWidth = slotWidth / 4;

    const startPosition =
      dragState.startHour * slotWidth + dragState.startMinute * quarterWidth;
    const endPosition =
      dragState.endHour * slotWidth + dragState.endMinute * quarterWidth;

    return {
      left: Math.min(startPosition, endPosition),
      width: Math.abs(endPosition - startPosition),
      top: 0,
    };
  };

  const getTimeFromMouseEvent = (event: React.MouseEvent, hour: number) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const quarterHour = Math.round((relativeX / rect.width) * 4);
    return {
      hour: hour,
      minute: Math.min(quarterHour, 3),
    };
  };

  const handleMouseDown = (hour: number, event: React.MouseEvent) => {
    const { hour: startHour, minute: startMinute } = getTimeFromMouseEvent(
      event,
      hour
    );
    let endHour = startHour;
    let endMinute = startMinute + 1;

    if (endMinute > 3) {
      endMinute = 0;
      endHour += 1;
    }

    setDragState({
      startHour,
      startMinute,
      endHour,
      endMinute,
      isDragging: true,
    });
  };

  const handleMouseMove = (hour: number, event: React.MouseEvent) => {
    if (dragState?.isDragging) {
      const { hour: endHour, minute: endMinute } = getTimeFromMouseEvent(
        event,
        hour
      );
      setDragState((prev) => ({
        ...prev!,
        endHour,
        endMinute,
      }));
    }
  };

  const formatTimeForInput = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${(minute * 15)
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (dragState) {
      const newEventId = Date.now().toString();
      const newEvent: CalendarEvent = {
        id: newEventId,
        title: "New Event",
        description: "",
        date: date,
        startTime: {
          hour: dragState.startHour,
          minute: dragState.startMinute,
        },
        endTime: {
          hour: dragState.endHour,
          minute: dragState.endMinute,
        },
      };

      setTempEvent(newEvent);
      setTempEventId(newEventId);

      setEventForm({
        title: "",
        description: "",
        startTime: formatTimeForInput(
          dragState.startHour,
          dragState.startMinute
        ),
        endTime: formatTimeForInput(dragState.endHour, dragState.endMinute),
        date: date,
      });

      setDialogOpen(true);
    }
    setDragState(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEventForm({
      title: event.title,
      description: event.description,
      startTime: formatTimeForInput(
        event.startTime.hour,
        event.startTime.minute
      ),
      endTime: formatTimeForInput(event.endTime.hour, event.endTime.minute),
      date: event.date,
    });
    setTempEventId(event.id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSaveEvent = () => {
    const [startHour, startMinute] = eventForm.startTime.split(":").map(Number);
    const [endHour, endMinute] = eventForm.endTime.split(":").map(Number);

    const eventData: CalendarEvent = {
      id: tempEventId!,
      title: eventForm.title,
      description: eventForm.description,
      date: eventForm.date,
      startTime: {
        hour: startHour,
        minute: startMinute / 15,
      },
      endTime: {
        hour: endHour,
        minute: endMinute / 15,
      },
    };

    if (isEditing) {
      onEventUpdate(eventData);
    } else {
      onEventCreate(eventData);
    }

    setTempEvent(null);
    setTempEventId(null);
    setIsEditing(false);
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTempEvent(null);
    setTempEventId(null);
    setIsEditing(false);
  };

  const calculateEventStyle = (event: CalendarEvent) => {
    const slotWidth = 120;
    const quarterWidth = slotWidth / 4;

    const startPosition =
      event.startTime.hour * slotWidth + event.startTime.minute * quarterWidth;
    const endPosition =
      event.endTime.hour * slotWidth + event.endTime.minute * quarterWidth;

    return {
      left: Math.min(startPosition, endPosition),
      width: Math.abs(endPosition - startPosition),
    };
  };

  const visibleEvents = [...events, ...(tempEvent ? [tempEvent] : [])].filter(
    (event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    }
  );

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    eventData: CalendarEvent
  ) => {
    event.dataTransfer.setData("application/json", JSON.stringify(eventData));
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, hour: number) => {
    event.preventDefault();
    const droppedEvent = JSON.parse(
      event.dataTransfer.getData("application/json")
    ) as CalendarEvent;

    // Calculate event duration
    const durationHours =
      droppedEvent.endTime.hour - droppedEvent.startTime.hour;
    const durationMinutes =
      droppedEvent.endTime.minute - droppedEvent.startTime.minute;

    // Update event with new date while maintaining duration
    const updatedEvent = {
      ...droppedEvent,
      date: date,
      startTime: {
        hour: hour,
        minute: 0,
      },
      endTime: {
        hour: hour + durationHours,
        minute: durationMinutes,
      },
    };

    onEventUpdate(updatedEvent);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <DayLabel>
          {format(date, "EEE")} {format(date, "d")}
        </DayLabel>

        <TimeSlots ref={timeGridRef}>
          {Array.from({ length: 24 }, (_, i) => (
            <TimeSlot
              key={i}
              onMouseDown={(e) => handleMouseDown(i + 1, e)}
              onMouseMove={(e) => handleMouseMove(i + 1, e)}
              onMouseUp={handleMouseUp}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i + 1)}
            />
          ))}
          {dragState && <DragSelection sx={calculateSelectionStyle()} />}
          {visibleEvents.map((event) => (
            <EventBlock
              key={event.id}
              draggable
              onDragStart={(e) => handleDragStart(e, event)}
              sx={calculateEventStyle(event)}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "11px",
                  marginBottom: "2px",
                }}
              >
                {`${formatTimeForInput(
                  event.startTime.hour,
                  event.startTime.minute
                )} - ${formatTimeForInput(
                  event.endTime.hour,
                  event.endTime.minute
                )}`}
              </Typography>
              {event.description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "11px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    display: "-webkit-box",
                  }}
                >
                  {event.description}
                </Typography>
              )}
            </EventBlock>
          ))}
        </TimeSlots>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            bgcolor: "#212121",
            color: "white",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={eventForm.title}
            onChange={(e) =>
              setEventForm({ ...eventForm, title: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": { color: "#808080" },
              "& .MuiInputBase-input": { color: "white" },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={eventForm.date}
              onChange={(newDate) => {
                if (newDate) {
                  setEventForm({ ...eventForm, date: newDate });
                }
              }}
              sx={{
                width: "100%",
                marginTop: 1,
                marginBottom: 1,
                "& .MuiInputLabel-root": { color: "#808080" },
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#808080" },
                  "&:hover fieldset": { borderColor: "#c0965c" },
                  "&.Mui-focused fieldset": { borderColor: "#c0965c" },
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={eventForm.description}
            onChange={(e) =>
              setEventForm({ ...eventForm, description: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": { color: "#808080" },
              "& .MuiInputBase-input": { color: "white" },
            }}
          />
          <TextField
            margin="dense"
            label="Start Time"
            type="time"
            value={eventForm.startTime}
            onChange={(e) =>
              setEventForm({ ...eventForm, startTime: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": { color: "#808080" },
              "& .MuiInputBase-input": { color: "white" },
            }}
          />
          <TextField
            margin="dense"
            label="End Time"
            type="time"
            value={eventForm.endTime}
            onChange={(e) =>
              setEventForm({ ...eventForm, endTime: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": { color: "#808080" },
              "& .MuiInputBase-input": { color: "white" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: "#808080" }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEvent} sx={{ color: "#c0965c" }}>
            {isEditing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

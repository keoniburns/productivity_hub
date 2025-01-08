import React from "react";
import {
  Box,
  Typography,
  Button,
  styled,
  IconButton,
  Slider,
} from "@mui/material";
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
  scrollPosition?: number;
  onScroll?: (
    event: React.ChangeEvent<{}> | null,
    value: number | number[]
  ) => void;
}

const ScrollBar = styled(Box)(() => ({
  height: "24px",
  padding: "2px 0",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  width: "200px",
}));

const CustomSlider = styled(Slider)(() => ({
  color: "#c0965c",
  "& .MuiSlider-thumb": {
    backgroundColor: "#c0965c",
    height: 16,
    width: 16,
    "&:hover": {
      backgroundColor: "#a17c4a",
    },
  },
  "& .MuiSlider-track": {
    backgroundColor: "#c0965c",
    height: 4,
  },
  "& .MuiSlider-rail": {
    backgroundColor: "#333333",
    height: 4,
  },
}));
export const CalendarHeader = ({
  title,
  onCreateEvent,
  onPreviousWeek,
  onNextWeek,
  scrollPosition = 0,
  onScroll = () => {},
}: CalendarHeaderProps) => (
  <StyledHeader>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        <IconButton onClick={onNextWeek} size="small" sx={{ color: "#c0965c" }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <ScrollBar>
        <CustomSlider
          value={scrollPosition}
          onChange={(_, value) => onScroll?.(null, value)}
          size="small"
        />
      </ScrollBar>
    </Box>
    <Button
      variant="contained"
      onClick={onCreateEvent}
      sx={{
        bgcolor: "#c0965c",
        "&:hover": {
          bgcolor: "#a17c4a",
        },
      }}
    >
      CREATE EVENT
    </Button>
  </StyledHeader>
);

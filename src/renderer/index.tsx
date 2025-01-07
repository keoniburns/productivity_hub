import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Box, Tab, Tabs } from "@mui/material";
import { CalendarView } from "./components/calendar/CalendarView";
import { JournalView } from "./components/journal/JournalView";
import { LeetCodeView } from "./components/leetcode/LeetCodeView";
import { NewsView } from "./components/news/NewsView";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1a1a1a",
      paper: "#212121",
    },
    primary: {
      main: "#c0965c",
    },
    divider: "#333333",
  },
});

const App = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "#212121",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTab-root": {
              color: "#808080",
              "&.Mui-selected": {
                color: "#c0965c",
              },
            },
          }}
        >
          <Tab label="Calendar" />
          <Tab label="Journal" />
          <Tab label="LeetCode" />
          <Tab label="News" />
        </Tabs>
      </Box>
      {value === 0 && <CalendarView />}
      {value === 1 && <JournalView />}
      {value === 2 && <LeetCodeView />}
      {value === 3 && <NewsView />}
    </Box>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);

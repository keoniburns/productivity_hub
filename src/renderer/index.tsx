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

  // Add keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey) {
        // Use Alt/Option key only
        // Use keyCode for more reliable cross-platform support
        switch (event.code) {
          case "Digit1": // 1
            setValue(0); // Calendar
            break;
          case "Digit2": // 2
            setValue(1); // Journal
            break;
          case "Digit3": // 3
            setValue(2); // LeetCode
            break;
          case "Digit4": // 4
            setValue(3); // News
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

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
              "&.Mui-selected": { color: "#c0965c" },
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

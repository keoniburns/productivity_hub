import React, { useState } from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  styled,
} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

const StyledPaper = styled(Paper)(() => ({
  backgroundColor: "#212121",
  borderRadius: 8,
  padding: 20,
  color: "#e0e0e0",
}));

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: string;
}

const dummyProblems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    starterCode: `def twoSum(self, nums: List[int], target: int) -> List[int]:\n    # Your code here\n    pass`,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description:
      "You are given two non-empty linked lists representing two non-negative integers.",
    starterCode: `def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:\n    # Your code here\n    pass`,
  },
];

export const LeetCodeView: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const getDifficultyColor = (difficulty: Problem["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "#00b8a3";
      case "Medium":
        return "#ffc01e";
      case "Hard":
        return "#ff375f";
      default:
        return "#f8f8f2";
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2, height: "calc(100vh - 100px)" }}>
      <StyledPaper sx={{ width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Problems
        </Typography>
        <List>
          {dummyProblems.map((problem) => (
            <ListItem
              key={problem.id}
              button
              onClick={() => {
                setSelectedProblem(problem);
                setCode(problem.starterCode);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(192, 150, 92, 0.1)",
                },
                backgroundColor:
                  selectedProblem?.id === problem.id
                    ? "rgba(192, 150, 92, 0.15)"
                    : "transparent",
              }}
            >
              <ListItemText
                primary={problem.title}
                secondary={
                  <Typography
                    sx={{ color: getDifficultyColor(problem.difficulty) }}
                  >
                    {problem.difficulty}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </StyledPaper>

      {selectedProblem ? (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 2 }}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedProblem.title}
            </Typography>
            <Typography>{selectedProblem.description}</Typography>
          </StyledPaper>

          <StyledPaper
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
              <CodeMirror
                value={code}
                height="100%"
                theme={oneDark}
                extensions={[python()]}
                onChange={(value) => setCode(value)}
                style={{ fontSize: 14 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#c0965c",
                  "&:hover": { bgcolor: "#a17c4a" },
                }}
              >
                Run Code
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#c0965c",
                  "&:hover": { bgcolor: "#a17c4a" },
                }}
              >
                Submit
              </Button>
            </Box>
          </StyledPaper>
        </Box>
      ) : (
        <StyledPaper
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "#6272a4" }}>
            Select a problem to begin
          </Typography>
        </StyledPaper>
      )}
    </Box>
  );
};

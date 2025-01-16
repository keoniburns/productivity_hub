import * as React from "react";
import Box from "@mui/material/Box";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import CodeMirror from "@uiw/react-codemirror";
import { Typography, Paper, Button, Stack } from "@mui/material";
import { python } from "@codemirror/lang-python";

interface LeetCodeItem extends TreeViewBaseItem {
  problem?: {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    starterCode: string;
  };
  children?: LeetCodeItem[];
}

const PROBLEM_CATEGORIES: LeetCodeItem[] = [
  {
    id: "arrays-hashing",
    label: "Arrays & Hashing",
    children: [
      {
        id: "two-sum",
        label: "Two Sum",
        problem: {
          id: 1,
          title: "Two Sum",
          difficulty: "Easy",
          description: "Given an array of integers...",
          starterCode:
            "def twoSum(self, nums: List[int], target: int):\n    pass",
        },
      },
    ],
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    children: [
      {
        id: "valid-palindrome",
        label: "Valid Palindrome",
        problem: {
          id: 2,
          title: "Valid Palindrome",
          difficulty: "Easy",
          description: "A phrase is a palindrome if...",
          starterCode: "def isPalindrome(self, s: str) -> bool:\n    pass",
        },
      },
    ],
  },
];

export default function LeetCodeView() {
  const [selectedProblem, setSelectedProblem] = React.useState<
    LeetCodeItem["problem"] | null
  >(null);
  const [code, setCode] = React.useState<string>("");

  const handleItemSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const findProblem = (
      items: LeetCodeItem[]
    ): LeetCodeItem["problem"] | undefined => {
      for (const item of items) {
        if (item.id === nodeId && item.problem) {
          setCode(item.problem.starterCode);
          return item.problem;
        }
        if (item.children) {
          const found = findProblem(item.children);
          if (found) return found;
        }
      }
    };

    const problem = findProblem(PROBLEM_CATEGORIES);
    if (problem) {
      setSelectedProblem(problem);
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
      <Box sx={{ width: 300, borderRight: 1, borderColor: "divider" }}>
        <RichTreeView
          items={PROBLEM_CATEGORIES}
          onItemClick={handleItemSelect}
          aria-label="LeetCode problems"
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          gap: 2,
        }}
      >
        {selectedProblem && (
          <>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                flex: "0 0 40%",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Typography variant="h5" gutterBottom>
                {selectedProblem.title}
                <Typography
                  component="span"
                  sx={{
                    ml: 2,
                    color:
                      selectedProblem.difficulty === "Easy"
                        ? "success.main"
                        : selectedProblem.difficulty === "Medium"
                        ? "warning.main"
                        : "error.main",
                  }}
                >
                  {selectedProblem.difficulty}
                </Typography>
              </Typography>
              <Typography>{selectedProblem.description}</Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                flex: "0 0 40%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                "& .cm-scroller": {
                  overflowY: "auto !important",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "4px",
                  },
                },
                "& .cm-editor": {
                  height: "100%",
                },
              }}
            >
              <CodeMirror
                value={code}
                height="100%"
                onChange={(value) => setCode(value)}
                theme="dark"
                extensions={[python()]}
              />
            </Paper>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                flex: "1",
                padding: 2,
                alignItems: "flex-start",
                justifyContent: "flex-end",
                pt: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log("Run Tests")}
              >
                Run Tests
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => console.log("Submit")}
              >
                Submit
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}

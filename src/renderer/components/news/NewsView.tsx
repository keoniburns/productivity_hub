// src/renderer/components/NewsView.tsx
import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Pagination,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const NewsCard = styled(Card)(() => ({
  backgroundColor: "#212121",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "rgba(192, 150, 92, 0.1)",
  },
  height: "100%",
}));

interface Article {
  title: string;
  source: {
    name: string;
  };
  description: string;
  content: string;
}

const dummyArticles = [
  {
    title: "SpaceX Successfully Launches Starship",
    source: { name: "Space News" },
    description: "Historic launch marks new era...",
    content: "SpaceX has successfully launched its Starship spacecraft...",
  },
  // ... add more dummy articles as needed
];

export const NewsView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState("Technology");
  const articlesPerPage = 6;

  // Reference to original dummy data:
  // src/views/news_view.py lines 28-119

  useEffect(() => {
    // Simulating API call with dummy data for now
    const fetchNews = async () => {
      // In real implementation, fetch from your news API
      setArticles(dummyArticles);
    };

    fetchNews();
  }, [selectedTopic]);

  const topics = [
    "Technology",
    "Programming",
    "Science",
    "AI",
    "Space",
    "Cybersecurity",
  ];

  const currentArticles = articles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  return (
    <Box sx={{ display: "flex", p: 2, gap: 2, height: "100vh" }}>
      <Paper
        sx={{
          width: 200,
          bgcolor: "#212121",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#f8f8f2", mb: 2 }}>
          Topics
        </Typography>
        <List>
          {topics.map((topic) => (
            <ListItem
              button
              key={topic}
              selected={selectedTopic === topic}
              onClick={() => setSelectedTopic(topic)}
              sx={{
                color: "#e0e0e0",
                "&.Mui-selected": {
                  backgroundColor: "rgba(192, 150, 92, 0.15)",
                },
                "&:hover": {
                  backgroundColor: "rgba(192, 150, 92, 0.1)",
                },
              }}
            >
              <ListItemText primary={topic} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ flex: 1 }}>
        <Grid container spacing={2}>
          {currentArticles.map((article, index) => (
            <Grid item xs={6} key={index}>
              <NewsCard>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#f8f8f2" }}>
                    {article.title}
                  </Typography>
                  <Typography sx={{ color: "#808080", my: 1 }}>
                    {article.description}
                  </Typography>
                  <Typography sx={{ color: "#808080", fontStyle: "italic" }}>
                    {article.content.slice(0, 150)}...
                  </Typography>
                  <Typography sx={{ color: "#c0965c", mt: 2 }}>
                    📰 {article.source.name}
                  </Typography>
                </CardContent>
              </NewsCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={Math.ceil(articles.length / articlesPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#f8f8f2",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

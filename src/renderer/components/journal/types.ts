export const MOOD_COLORS = {
  Happy: "#4caf50",    // Green
  Peaceful: "#2196f3", // Blue
  Neutral: "#9e9e9e",  // Gray
  Anxious: "#ff9800",  // Orange
  Sad: "#7986cb"       // Indigo
};

export interface JournalEntry {
  id?: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
} 
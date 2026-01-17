// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  points: number;
  streak: number;
  level: number;
  badges: Badge[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  chapters: Chapter[];
  progress: number; // 0-100
  enrolledAt?: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  progress: number; // 0-100
  unlocked: boolean;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  content: string; // markdown
  order: number;
  duration: number; // in minutes
  completed: boolean;
  unlocked: boolean;
}

// Notes Types
export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  points: number;
  streak: number;
  level: number;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}








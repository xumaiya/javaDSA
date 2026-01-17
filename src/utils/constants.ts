// API Base URL - will be replaced with real backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'dsa_platform_auth_token',
  USER: 'dsa_platform_user',
  THEME: 'dsa_platform_theme',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:courseId',
  CHAPTER: '/courses/:courseId/chapters/:chapterId',
  LESSON: '/courses/:courseId/chapters/:chapterId/lessons/:lessonId',
  NOTES: '/notes',
  CHATBOT: '/chatbot',
  BADGES: '/badges',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
} as const;

// Theme
export type Theme = 'light' | 'dark';

// Difficulty Colors - using new olive palette
export const DIFFICULTY_COLORS = {
  beginner: 'bg-olive-pale text-olive-dark dark:bg-olive dark:text-olive-pale',
  intermediate: 'bg-olive-light text-olive-dark dark:bg-olive dark:text-olive-pale',
  advanced: 'bg-olive text-white dark:bg-olive-dark dark:text-olive-pale',
} as const;

// Badge Rarity Colors - using new olive palette
export const BADGE_RARITY_COLORS = {
  common: 'bg-olive-light text-olive-dark dark:bg-olive dark:text-olive-pale',
  rare: 'bg-olive-pale text-olive-dark dark:bg-olive dark:text-olive-pale',
  epic: 'bg-olive text-white dark:bg-olive-dark dark:text-olive-pale',
  legendary: 'bg-olive-dark text-olive-pale dark:bg-olive-dark dark:text-olive-pale',
} as const;








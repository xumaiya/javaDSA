// API Service - This will be used to replace mock API with real backend calls
// For now, it uses the mock API, but the structure allows easy replacement

import { mockApi } from '../mock/api';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import type {
  User,
  Course,
  Chapter,
  Lesson,
  Note,
  Badge,
  LeaderboardEntry,
  AuthResponse,
  ChatMessage,
  ApiResponse,
} from '../types';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Backend API response wrapper type
interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Backend chat response type matching ChatResponse.java
interface BackendChatResponse {
  id: string;
  content: string;
  confidenceScore?: number;
  relatedChapters?: Array<{
    chapterId: number;
    chapterTitle: string;
    relevanceScore: number;
  }>;
  timestamp: string;
}

// User progress response type
export interface UserProgress {
  completedLessonIds: number[];
}

// In production, replace mockApi calls with actual axios calls to the backend
// Example: return api.post('/auth/login', { email, password });

class ApiService {
  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return mockApi.login(email, password);
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return mockApi.register(username, email, password);
  }

  async logout(): Promise<void> {
    return mockApi.logout();
  }

  // User Progress - Real backend API calls
  async getUserProgress(): Promise<ApiResponse<UserProgress>> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error('Failed to fetch progress.');
      }

      const backendResponse: BackendApiResponse<number[]> = await response.json();
      
      return { 
        data: { 
          completedLessonIds: backendResponse.data || [] 
        } 
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - return empty progress instead of failing
        return { data: { completedLessonIds: [] } };
      }
      throw error;
    }
  }

  async completeLessonOnBackend(lessonId: string): Promise<ApiResponse<void>> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error('Failed to complete lesson.');
      }

      return { data: undefined };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection.');
      }
      throw error;
    }
  }

  // Courses
  async getCourses(): Promise<ApiResponse<Course[]>> {
    return mockApi.getCourses();
  }

  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    return mockApi.getCourseById(courseId);
  }

  async enrollInCourse(courseId: string): Promise<ApiResponse<Course>> {
    return mockApi.enrollInCourse(courseId);
  }

  // Chapters
  async getChapterById(courseId: string, chapterId: string): Promise<ApiResponse<Chapter>> {
    return mockApi.getChapterById(courseId, chapterId);
  }

  // Lessons
  async getLessonById(courseId: string, chapterId: string, lessonId: string): Promise<ApiResponse<Lesson>> {
    return mockApi.getLessonById(courseId, chapterId, lessonId);
  }

  async completeLesson(lessonId: string): Promise<ApiResponse<Lesson>> {
    return mockApi.completeLesson(lessonId);
  }

  // Notes
  async getNotes(lessonId?: string): Promise<ApiResponse<Note[]>> {
    return mockApi.getNotes(lessonId);
  }

  async getNoteById(noteId: string): Promise<ApiResponse<Note>> {
    return mockApi.getNoteById(noteId);
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Note>> {
    return mockApi.createNote(note);
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<ApiResponse<Note>> {
    return mockApi.updateNote(noteId, updates);
  }

  async deleteNote(noteId: string): Promise<ApiResponse<void>> {
    return mockApi.deleteNote(noteId);
  }

  // Badges
  async getBadges(): Promise<ApiResponse<Badge[]>> {
    return mockApi.getBadges();
  }

  async getUserBadges(userId: string): Promise<ApiResponse<Badge[]>> {
    return mockApi.getUserBadges(userId);
  }

  // Leaderboard
  async getLeaderboard(limit?: number): Promise<ApiResponse<LeaderboardEntry[]>> {
    return mockApi.getLeaderboard(limit);
  }

  // Chatbot - Real backend API call
  async sendChatMessage(message: string, _conversationId?: string): Promise<ApiResponse<ChatMessage>> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in to use the chatbot.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message. Please try again.');
      }

      const backendResponse: BackendApiResponse<BackendChatResponse> = await response.json();
      
      // Transform backend response to frontend ChatMessage format
      const chatMessage: ChatMessage = {
        id: backendResponse.data.id || `msg_${Date.now()}`,
        role: 'assistant',
        content: backendResponse.data.content,
        timestamp: backendResponse.data.timestamp || new Date().toISOString(),
      };

      return { data: chatMessage };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection and try again.');
      }
      throw error;
    }
  }

  // User Profile
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return mockApi.getUserProfile(userId);
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return mockApi.updateUserProfile(userId, updates);
  }
}

export const apiService = new ApiService();








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

// Lesson content response type
export interface LessonContentResponse {
  lessonId: string;
  lessonTitle: string;
  topic: string;
  content: string;  // Markdown content
  generatedAt: string;
  cached: boolean;
}

// User stats response type
export interface UserStatsResponse {
  points: number;
  streak: number;
  level: number;
  completedLessonsCount: number;
  enrolledCoursesCount: number;
  averageProgress: number;
  weeklyActivity: number[]; // 7 days (Mon-Sun)
  pointsThisWeek: number;
}

// In production, replace mockApi calls with actual axios calls to the backend
// Example: return api.post('/auth/login', { email, password });

class ApiService {
  // Authentication - Real backend API calls
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const backendResponse = await response.json();
      // Transform backend response to match frontend AuthResponse type
      return {
        data: {
          user: backendResponse.data.user,
          token: backendResponse.data.accessToken,
        },
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection.');
      }
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const backendResponse = await response.json();
      // Transform backend response to match frontend AuthResponse type
      return {
        data: {
          user: backendResponse.data.user,
          token: backendResponse.data.accessToken,
        },
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection.');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Just clear local storage, no backend call needed
    return Promise.resolve();
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

  async getUserStats(): Promise<ApiResponse<UserStatsResponse>> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    console.log('📊 [apiService] Fetching user stats...');

    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📥 [apiService] Stats response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error('Failed to fetch user stats.');
      }

      const backendResponse: BackendApiResponse<UserStatsResponse> = await response.json();
      console.log('✅ [apiService] Stats received:', backendResponse.data);
      
      return { data: backendResponse.data };
    } catch (error) {
      console.error('💥 [apiService] Error fetching stats:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - return default stats
        return { 
          data: { 
            points: 0,
            streak: 0,
            level: 1,
            completedLessonsCount: 0,
            enrolledCoursesCount: 0,
            averageProgress: 0,
            weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
            pointsThisWeek: 0
          } 
        };
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

  async getLessonContent(lessonId: string, lessonTitle: string, topic: string): Promise<ApiResponse<LessonContentResponse>> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    console.log(`📚 [apiService] Fetching content for lesson: ${lessonTitle}`);

    try {
      const url = `${API_BASE_URL}/lessons/${encodeURIComponent(lessonId)}/content?lessonTitle=${encodeURIComponent(lessonTitle)}&topic=${encodeURIComponent(topic)}`;
      console.log(`🌐 [apiService] URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`📥 [apiService] Response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        const errorText = await response.text();
        console.error('❌ [apiService] Error:', errorText);
        throw new Error('Failed to fetch lesson content.');
      }

      const backendResponse: BackendApiResponse<LessonContentResponse> = await response.json();
      console.log(`✅ [apiService] Content received (${backendResponse.data.cached ? 'cached' : 'generated'})`);
      
      return { data: backendResponse.data };
    } catch (error) {
      console.error('💥 [apiService] Error fetching lesson content:', error);
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
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    try {
      // First, enroll in backend
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
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
        throw new Error('Failed to enroll in course.');
      }

      // Also enroll in mock API for local state
      return mockApi.enrollInCourse(courseId);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - fallback to mock only
        return mockApi.enrollInCourse(courseId);
      }
      throw error;
    }
  }

  async getEnrolledCourses(): Promise<ApiResponse<string[]>> {
    const token = getAuthToken();
    
    if (!token) {
      return { data: [] };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/enrolled`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return { data: [] };
      }

      const backendResponse: BackendApiResponse<string[]> = await response.json();
      return { data: backendResponse.data };
    } catch (error) {
      return { data: [] };
    }
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
    const token = getAuthToken();
    
    if (!token) {
      // If not authenticated, return mock badges
      return mockApi.getBadges();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/badges`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Fallback to mock on error
        return mockApi.getBadges();
      }

      const backendResponse: BackendApiResponse<Badge[]> = await response.json();
      return { data: backendResponse.data };
    } catch (error) {
      // Fallback to mock on error
      return mockApi.getBadges();
    }
  }

  async getUserBadges(userId: string): Promise<ApiResponse<Badge[]>> {
    const token = getAuthToken();
    
    if (!token) {
      // If not authenticated, return empty array
      return { data: [] };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/badges/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Return empty array on error
        return { data: [] };
      }

      const backendResponse: BackendApiResponse<Badge[]> = await response.json();
      return { data: backendResponse.data };
    } catch (error) {
      // Return empty array on error
      return { data: [] };
    }
  }

  // Chatbot - Real backend API call with conversation history
  async sendChatMessage(
    message: string, 
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<ApiResponse<ChatMessage>> {
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
        body: JSON.stringify({ 
          message,
          conversationHistory: conversationHistory || [],
        }),
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








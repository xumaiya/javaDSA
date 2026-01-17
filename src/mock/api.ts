import { 
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
import { mockUsers, mockCourses, mockBadges, mockLeaderboard } from './data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage keys
const NOTES_STORAGE_KEY = 'dsa_platform_notes';
const COURSES_STORAGE_KEY = 'dsa_platform_courses';

// Helper to get/set localStorage data
const getStoredNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredNotes = (notes: Note[]) => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

const getStoredCourses = (): Course[] => {
  try {
    const stored = localStorage.getItem(COURSES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockCourses;
  } catch {
    return mockCourses;
  }
};

const setStoredCourses = (courses: Course[]) => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
};

// Initialize courses from localStorage or mock data
let courses = getStoredCourses();

// Mock API Service
class MockApiService {
  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    await delay(800);
    
    if (!email || typeof email !== 'string' || email.trim() === '') {
      throw new Error('Email is required');
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('Password is required');
    }
    
    const user = mockUsers.find(u => u.email === email.trim().toLowerCase());
    
    if (!user || password !== 'password') {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock_token_${user.id}_${Date.now()}`;
    return {
      data: {
        user,
        token,
      },
    };
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    void password;
    await delay(1000);
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      points: 0,
      streak: 0,
      level: 1,
      badges: [],
      createdAt: new Date().toISOString(),
    };
    const token = `mock_token_${newUser.id}`;
    return {
      data: {
        user: newUser,
        token,
      },
    };
  }

  async logout(): Promise<void> {
    await delay(300);
  }

  // Courses
  async getCourses(): Promise<ApiResponse<Course[]>> {
    await delay(600);
    courses = getStoredCourses();
    return { data: courses };
  }

  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    await delay(500);
    courses = getStoredCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    return { data: course };
  }

  async enrollInCourse(courseId: string): Promise<ApiResponse<Course>> {
    await delay(700);
    courses = getStoredCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) throw new Error('Course not found');
    
    courses[courseIndex] = {
      ...courses[courseIndex],
      enrolledAt: new Date().toISOString(),
    };
    
    setStoredCourses(courses);
    return { data: courses[courseIndex] };
  }

  // Chapters
  async getChapterById(courseId: string, chapterId: string): Promise<ApiResponse<Chapter>> {
    await delay(400);
    courses = getStoredCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    const chapter = course.chapters.find(ch => ch.id === chapterId);
    if (!chapter) throw new Error('Chapter not found');
    return { data: chapter };
  }

  // Lessons
  async getLessonById(courseId: string, chapterId: string, lessonId: string): Promise<ApiResponse<Lesson>> {
    await delay(400);
    courses = getStoredCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    const chapter = course.chapters.find(ch => ch.id === chapterId);
    if (!chapter) throw new Error('Chapter not found');
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return { data: lesson };
  }

  async completeLesson(lessonId: string): Promise<ApiResponse<Lesson>> {
    await delay(500);
    courses = getStoredCourses();
    
    for (const course of courses) {
      for (const chapter of course.chapters) {
        const lessonIndex = chapter.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex !== -1) {
          chapter.lessons[lessonIndex] = {
            ...chapter.lessons[lessonIndex],
            completed: true,
          };
          
          // Update course progress
          const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
          const completedLessons = course.chapters.reduce(
            (sum, ch) => sum + ch.lessons.filter(l => l.completed).length, 
            0
          );
          course.progress = Math.round((completedLessons / totalLessons) * 100);
          
          setStoredCourses(courses);
          return { data: chapter.lessons[lessonIndex] };
        }
      }
    }
    
    throw new Error('Lesson not found');
  }

  // Notes - Now persisted to localStorage
  async getNotes(lessonId?: string): Promise<ApiResponse<Note[]>> {
    await delay(400);
    let notes = getStoredNotes();
    if (lessonId) {
      notes = notes.filter(n => n.lessonId === lessonId);
    }
    return { data: notes };
  }

  async getNoteById(noteId: string): Promise<ApiResponse<Note>> {
    await delay(300);
    const notes = getStoredNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) throw new Error('Note not found');
    return { data: note };
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Note>> {
    await delay(500);
    const notes = getStoredNotes();
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.push(newNote);
    setStoredNotes(notes);
    return { data: newNote };
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<ApiResponse<Note>> {
    await delay(500);
    const notes = getStoredNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStoredNotes(notes);
    return { data: notes[index] };
  }

  async deleteNote(noteId: string): Promise<ApiResponse<void>> {
    await delay(400);
    const notes = getStoredNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) throw new Error('Note not found');
    notes.splice(index, 1);
    setStoredNotes(notes);
    return { data: undefined };
  }

  // Badges
  async getBadges(): Promise<ApiResponse<Badge[]>> {
    await delay(400);
    return { data: mockBadges };
  }

  async getUserBadges(userId: string): Promise<ApiResponse<Badge[]>> {
    void userId;
    await delay(400);
    return { data: mockBadges.slice(0, 2) };
  }

  // Leaderboard
  async getLeaderboard(limit = 10): Promise<ApiResponse<LeaderboardEntry[]>> {
    await delay(500);
    return { data: mockLeaderboard.slice(0, limit) };
  }

  // Chatbot
  async sendChatMessage(message: string, conversationId?: string): Promise<ApiResponse<ChatMessage>> {
    void conversationId;
    await delay(1000);
    
    // Enhanced mock response with DSA-related content
    const dsaResponses: Record<string, string> = {
      array: "Arrays are fundamental data structures that store elements in contiguous memory locations. They provide O(1) access time for elements by index, making them efficient for random access operations.",
      linked: "Linked lists are linear data structures where elements are stored in nodes, with each node pointing to the next. They excel at insertions and deletions but have O(n) access time.",
      stack: "A stack is a LIFO (Last-In-First-Out) data structure. Common operations include push, pop, and peek, all with O(1) time complexity.",
      queue: "A queue is a FIFO (First-In-First-Out) data structure. It supports enqueue and dequeue operations, useful for BFS traversal and task scheduling.",
      tree: "Trees are hierarchical data structures with a root node and child nodes. Binary trees, BSTs, and balanced trees like AVL and Red-Black trees are common variants.",
      graph: "Graphs consist of vertices and edges, representing relationships between objects. They can be directed or undirected, weighted or unweighted.",
      sort: "Sorting algorithms arrange elements in order. Common ones include QuickSort (O(n log n) average), MergeSort (O(n log n) guaranteed), and HeapSort.",
      search: "Searching algorithms find elements in data structures. Binary search achieves O(log n) on sorted arrays, while linear search is O(n).",
    };
    
    const lowerMessage = message.toLowerCase();
    let responseContent = "I can help you with Data Structures and Algorithms! Ask me about arrays, linked lists, stacks, queues, trees, graphs, sorting, or searching algorithms.";
    
    for (const [keyword, response] of Object.entries(dsaResponses)) {
      if (lowerMessage.includes(keyword)) {
        responseContent = response;
        break;
      }
    }
    
    const response: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
    };
    return { data: response };
  }

  // User Profile
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    await delay(400);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { data: user };
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    await delay(600);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { data: { ...user, ...updates } };
  }
}

export const mockApi = new MockApiService();

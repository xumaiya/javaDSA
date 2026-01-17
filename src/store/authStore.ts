import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  completedLessonIds: number[];
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
  setCompletedLessonIds: (lessonIds: number[]) => void;
  addCompletedLesson: (lessonId: number) => void;
  isLessonCompleted: (lessonId: string | number) => boolean;
}

// Custom storage that uses the STORAGE_KEYS for consistency
const authStorage = {
  getItem: (name: string): string | null => {
    // Try to get from the unified storage key first
    const storedValue = localStorage.getItem(name);
    if (storedValue) {
      return storedValue;
    }
    
    // Fallback: migrate from legacy keys if they exist
    const legacyToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const legacyUser = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (legacyToken && legacyUser) {
      try {
        const user = JSON.parse(legacyUser);
        const migratedState = {
          state: {
            user,
            token: legacyToken,
            isAuthenticated: true,
            completedLessonIds: [],
          },
          version: 0,
        };
        // Store in new format and clean up legacy keys
        const migratedValue = JSON.stringify(migratedState);
        localStorage.setItem(name, migratedValue);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return migratedValue;
      } catch {
        return null;
      }
    }
    
    return null;
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value);
    
    // Also sync to legacy keys for backward compatibility with other parts of the app
    try {
      const parsed = JSON.parse(value);
      if (parsed.state?.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, parsed.state.token);
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      if (parsed.state?.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed.state.user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // Ignore parse errors
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
    // Also clean up legacy keys
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      completedLessonIds: [],
      setAuth: (user, token) => {
        // Let Zustand persist middleware handle storage via custom storage adapter
        set({ user, token, isAuthenticated: true, completedLessonIds: [] });
      },
      clearAuth: () => {
        // Let Zustand persist middleware handle storage via custom storage adapter
        set({ user: null, token: null, isAuthenticated: false, completedLessonIds: [] });
      },
      updateUser: (updates) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };
          // Let Zustand persist middleware handle storage via custom storage adapter
          return { user: updatedUser };
        });
      },
      setCompletedLessonIds: (lessonIds) => {
        set({ completedLessonIds: lessonIds });
      },
      addCompletedLesson: (lessonId) => {
        const currentIds = get().completedLessonIds;
        if (!currentIds.includes(lessonId)) {
          set({ completedLessonIds: [...currentIds, lessonId] });
        }
      },
      isLessonCompleted: (lessonId) => {
        const numericId = typeof lessonId === 'string' ? parseInt(lessonId, 10) : lessonId;
        return get().completedLessonIds.includes(numericId);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        completedLessonIds: state.completedLessonIds,
      }),
    }
  )
);








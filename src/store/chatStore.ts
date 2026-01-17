import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  getConversationHistory: () => Array<{ role: string; content: string }>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },
      
      setMessages: (messages) => {
        set({ messages });
      },
      
      clearMessages: () => {
        set({ messages: [] });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      // Get conversation history for API calls (last 10 messages)
      getConversationHistory: () => {
        const messages = get().messages;
        const recentMessages = messages.slice(-10);
        return recentMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
);

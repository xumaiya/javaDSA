import { QuizQuestion } from '../types';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

class QuizService {
  /**
   * Generate quiz questions using AI (OpenRouter via backend)
   */
  async generateQuizQuestions(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    questionCount: number = 5
  ): Promise<QuizQuestion[]> {
    console.log('🎯 [QuizService] Starting quiz generation...');
    console.log('📝 [QuizService] Topic:', topic);
    console.log('📊 [QuizService] Difficulty:', difficulty);
    console.log('🔢 [QuizService] Question Count:', questionCount);
    
    const token = getAuthToken();
    
    if (!token) {
      console.error('❌ [QuizService] No auth token found!');
      throw new Error('Authentication required. Please log in to generate quizzes.');
    }
    
    console.log('✅ [QuizService] Auth token found:', token.substring(0, 20) + '...');

    try {
      const apiUrl = `${API_BASE_URL}/quiz/generate`;
      console.log('🌐 [QuizService] API URL:', apiUrl);
      console.log('📤 [QuizService] Sending request...');
      
      const requestBody = { 
        topic,
        difficulty,
        questionCount,
      };
      console.log('📦 [QuizService] Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 [QuizService] Response status:', response.status);
      console.log('📥 [QuizService] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [QuizService] API error response:', errorText);
        
        if (response.status === 401) {
          console.error('🔒 [QuizService] Authentication failed!');
          throw new Error('Session expired. Please log in again.');
        }
        if (response.status === 404) {
          console.error('🔍 [QuizService] Endpoint not found! Check if backend is running.');
          throw new Error('Quiz endpoint not found. Is the backend running?');
        }
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ [QuizService] Received response data:', JSON.stringify(data, null, 2));
      
      if (!data.data || !data.data.questions) {
        console.error('❌ [QuizService] Invalid response format:', data);
        throw new Error('Invalid response format from backend');
      }
      
      // Transform backend response to frontend QuizQuestion format
      const questions: QuizQuestion[] = data.data.questions.map((q: any, index: number) => {
        console.log(`✅ [QuizService] Question ${index + 1}:`, q.question);
        return {
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        };
      });
      
      console.log(`🎉 [QuizService] Successfully generated ${questions.length} AI questions!`);
      return questions;
      
    } catch (error) {
      console.error('💥 [QuizService] Error generating quiz:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 [QuizService] Network error - backend might not be running');
        throw new Error('Unable to connect to backend. Is it running on ' + API_BASE_URL + '?');
      }
      
      throw error;
    }
  }
}

export const quizService = new QuizService();

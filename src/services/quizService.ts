import { QuizQuestion } from '../types';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

interface QuizGenerationResponse {
  questions: QuizQuestion[];
}

class QuizService {
  /**
   * Generate quiz questions using AI (OpenRouter via backend)
   */
  async generateQuizQuestions(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    questionCount: number = 5
  ): Promise<QuizQuestion[]> {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token found. User must be logged in.');
      throw new Error('Authentication required. Please log in to generate quizzes.');
    }

    console.log(`Generating ${questionCount} quiz questions for topic: ${topic} (${difficulty})`);

    try {
      // Create a prompt for the AI to generate quiz questions
      const prompt = this.buildQuizPrompt(topic, difficulty, questionCount);
      
      console.log('Calling backend API:', `${API_BASE_URL}/chat/ask`);
      
      // Use the existing chat endpoint to generate questions
      const response = await fetch(`${API_BASE_URL}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          message: prompt,
          conversationHistory: [],
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed. Token may be expired.');
          throw new Error('Session expired. Please log in again.');
        }
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error('Failed to generate quiz questions. Please try again.');
      }

      const data = await response.json();
      console.log('Received AI response, parsing questions...');
      
      // Parse the AI response to extract quiz questions
      const questions = this.parseQuizResponse(data.data.content, topic);
      
      console.log(`Successfully generated ${questions.length} questions`);
      return questions;
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your connection.');
      }
      throw error;
    }
  }

  /**
   * Build a prompt for AI to generate quiz questions
   */
  private buildQuizPrompt(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    count: number
  ): string {
    return `Generate ${count} multiple-choice quiz questions about ${topic} in Java for ${difficulty} level students.

IMPORTANT: You MUST respond with ONLY valid JSON in this exact format, with no additional text before or after:

{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Each question should test understanding of ${topic} concepts in Java
- Provide exactly 4 options for each question
- correctAnswer should be the index (0-3) of the correct option
- Make questions appropriate for ${difficulty} level
- Include clear explanations
- Focus on practical Java DSA concepts
- Use simple, clear language (ELI10 style for beginner)

Generate ${count} questions now in the JSON format above.`;
  }

  /**
   * Parse AI response to extract quiz questions
   */
  private parseQuizResponse(content: string, topic: string): QuizQuestion[] {
    try {
      // Try to extract JSON from the response
      // Look for JSON block in markdown code blocks or raw JSON
      let jsonStr = content;
      
      // Remove markdown code blocks if present
      const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      }
      
      // Try to find JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*"questions"[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonStr) as QuizGenerationResponse;
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response format');
      }
      
      // Add IDs to questions
      return parsed.questions.map((q, index) => ({
        ...q,
        id: `ai_q_${Date.now()}_${index}`,
      }));
    } catch (error) {
      console.error('Failed to parse quiz response:', error);
      console.error('Content:', content);
      
      // Return fallback questions if parsing fails
      return this.getFallbackQuestions(topic);
    }
  }

  /**
   * Get fallback questions if AI generation fails
   */
  private getFallbackQuestions(topic: string): QuizQuestion[] {
    const fallbackQuestions: Record<string, QuizQuestion[]> = {
      'Arrays': [
        {
          id: 'fallback_arrays_1',
          question: 'What is the time complexity of accessing an element in an array by index in Java?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 0,
          explanation: 'Arrays provide constant time O(1) access because elements are stored in contiguous memory locations.',
        },
        {
          id: 'fallback_arrays_2',
          question: 'How do you declare an integer array of size 10 in Java?',
          options: ['int[] arr = new int[10];', 'int arr[10];', 'array<int> arr(10);', 'int arr = new int[10];'],
          correctAnswer: 0,
          explanation: 'In Java, arrays are declared using the syntax: type[] name = new type[size];',
        },
        {
          id: 'fallback_arrays_3',
          question: 'What happens if you try to access an array index that doesn\'t exist in Java?',
          options: ['The program crashes', 'ArrayIndexOutOfBoundsException is thrown', 'Returns null', 'Returns 0'],
          correctAnswer: 1,
          explanation: 'Java throws an ArrayIndexOutOfBoundsException when you try to access an invalid array index.',
        },
      ],
      'Linked Lists': [
        {
          id: 'fallback_ll_1',
          question: 'What is the main advantage of a linked list over an array?',
          options: ['Faster access time', 'Dynamic size', 'Less memory usage', 'Better cache performance'],
          correctAnswer: 1,
          explanation: 'Linked lists can grow or shrink dynamically without needing to reallocate memory.',
        },
        {
          id: 'fallback_ll_2',
          question: 'In a singly linked list, each node contains:',
          options: ['Only data', 'Data and a reference to the next node', 'Data and two references', 'Only a reference'],
          correctAnswer: 1,
          explanation: 'A singly linked list node contains data and a reference (pointer) to the next node.',
        },
        {
          id: 'fallback_ll_3',
          question: 'What is the time complexity of inserting at the beginning of a linked list?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 0,
          explanation: 'Inserting at the beginning of a linked list is O(1) as it only requires updating the head pointer.',
        },
      ],
      'Stacks': [
        {
          id: 'fallback_stack_1',
          question: 'Which data structure follows LIFO (Last In First Out) principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctAnswer: 1,
          explanation: 'Stack follows LIFO - the last element added is the first one to be removed.',
        },
        {
          id: 'fallback_stack_2',
          question: 'What are the two main operations of a stack?',
          options: ['Insert and Delete', 'Push and Pop', 'Enqueue and Dequeue', 'Add and Remove'],
          correctAnswer: 1,
          explanation: 'The two main stack operations are Push (add to top) and Pop (remove from top).',
        },
        {
          id: 'fallback_stack_3',
          question: 'Which Java class implements the Stack data structure?',
          options: ['ArrayList', 'LinkedList', 'Stack', 'Vector'],
          correctAnswer: 2,
          explanation: 'Java provides a Stack class in java.util package that implements the stack data structure.',
        },
      ],
      'Queues': [
        {
          id: 'fallback_queue_1',
          question: 'Which principle does a queue follow?',
          options: ['LIFO', 'FIFO', 'FILO', 'Random'],
          correctAnswer: 1,
          explanation: 'Queue follows FIFO (First In First Out) - the first element added is the first one removed.',
        },
        {
          id: 'fallback_queue_2',
          question: 'What are the two main operations of a queue?',
          options: ['Push and Pop', 'Insert and Delete', 'Enqueue and Dequeue', 'Add and Poll'],
          correctAnswer: 2,
          explanation: 'The two main queue operations are Enqueue (add to rear) and Dequeue (remove from front).',
        },
        {
          id: 'fallback_queue_3',
          question: 'Which Java interface represents a queue?',
          options: ['List', 'Set', 'Queue', 'Collection'],
          correctAnswer: 2,
          explanation: 'Java provides a Queue interface in java.util package for queue implementations.',
        },
      ],
      'Trees': [
        {
          id: 'fallback_tree_1',
          question: 'In a binary tree, what is the maximum number of children a node can have?',
          options: ['1', '2', '3', 'Unlimited'],
          correctAnswer: 1,
          explanation: 'In a binary tree, each node can have at most 2 children (left and right).',
        },
        {
          id: 'fallback_tree_2',
          question: 'What is the root of a tree?',
          options: ['The last node', 'The topmost node', 'The middle node', 'Any leaf node'],
          correctAnswer: 1,
          explanation: 'The root is the topmost node in a tree, which has no parent.',
        },
        {
          id: 'fallback_tree_3',
          question: 'In a Binary Search Tree (BST), where are smaller values placed?',
          options: ['Right subtree', 'Left subtree', 'At the root', 'Randomly'],
          correctAnswer: 1,
          explanation: 'In a BST, values smaller than the parent are placed in the left subtree.',
        },
      ],
    };

    // Try to find matching fallback questions
    for (const [key, questions] of Object.entries(fallbackQuestions)) {
      if (topic.toLowerCase().includes(key.toLowerCase())) {
        return questions.slice(0, 5);
      }
    }

    // Default fallback
    return fallbackQuestions['Arrays'].slice(0, 5);
  }
}

export const quizService = new QuizService();

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Trophy,
  RotateCcw,
  BookOpen,
  Timer,
  Target,
} from 'lucide-react';
import { Quiz, QuizQuestion, QuizResult, Course } from '../types';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { apiService } from '../services/apiService';

// Quiz data for each course
const generateQuizForCourse = (course: Course): Quiz => {
  const quizQuestions: Record<string, QuizQuestion[]> = {
    '1': [ // Data Structures Fundamentals
      {
        id: 'q1-1',
        question: 'What is the time complexity of accessing an element in an array by index?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Arrays provide constant time O(1) access because elements are stored in contiguous memory locations.',
      },
      {
        id: 'q1-2',
        question: 'Which data structure follows LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 1,
        explanation: 'Stack follows LIFO - the last element added is the first one to be removed.',
      },
      {
        id: 'q1-3',
        question: 'What is the main advantage of a linked list over an array?',
        options: ['Faster access time', 'Dynamic size', 'Less memory usage', 'Better cache performance'],
        correctAnswer: 1,
        explanation: 'Linked lists can grow or shrink dynamically without needing to reallocate memory.',
      },
      {
        id: 'q1-4',
        question: 'In a binary tree, what is the maximum number of nodes at level k?',
        options: ['k', '2k', '2^k', 'k²'],
        correctAnswer: 2,
        explanation: 'At level k, a binary tree can have at most 2^k nodes.',
      },
      {
        id: 'q1-5',
        question: 'Which operation is NOT typically O(1) for a hash table?',
        options: ['Insert', 'Delete', 'Search', 'Traversal'],
        correctAnswer: 3,
        explanation: 'Traversing all elements in a hash table is O(n), while insert, delete, and search are typically O(1).',
      },
    ],
    '2': [ // Algorithm Design & Analysis
      {
        id: 'q2-1',
        question: 'What is the time complexity of binary search?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 2,
        explanation: 'Binary search divides the search space in half each iteration, resulting in O(log n).',
      },
      {
        id: 'q2-2',
        question: 'Which sorting algorithm has the best average-case time complexity?',
        options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'],
        correctAnswer: 2,
        explanation: 'Quick Sort has an average time complexity of O(n log n).',
      },
      {
        id: 'q2-3',
        question: 'What technique does merge sort use?',
        options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'],
        correctAnswer: 2,
        explanation: 'Merge sort divides the array, sorts each half, and merges them back together.',
      },
      {
        id: 'q2-4',
        question: 'What is the space complexity of merge sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Merge sort requires O(n) additional space for the temporary arrays during merging.',
      },
      {
        id: 'q2-5',
        question: 'Which algorithm is best for finding the shortest path in an unweighted graph?',
        options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'],
        correctAnswer: 1,
        explanation: 'BFS finds the shortest path in unweighted graphs as it explores level by level.',
      },
    ],
    '3': [ // Advanced Data Structures
      {
        id: 'q3-1',
        question: 'What is the height of a balanced AVL tree with n nodes?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
        explanation: 'AVL trees maintain balance, ensuring height is always O(log n).',
      },
      {
        id: 'q3-2',
        question: 'What is the main advantage of a B-tree over a binary search tree?',
        options: ['Simpler implementation', 'Better for disk-based storage', 'Faster in-memory operations', 'Less memory usage'],
        correctAnswer: 1,
        explanation: 'B-trees minimize disk I/O by storing multiple keys per node, making them ideal for databases.',
      },
      {
        id: 'q3-3',
        question: 'What data structure is used to implement a priority queue efficiently?',
        options: ['Array', 'Linked List', 'Heap', 'Stack'],
        correctAnswer: 2,
        explanation: 'Heaps provide O(log n) insert and extract-min/max operations for priority queues.',
      },
      {
        id: 'q3-4',
        question: 'What is a trie primarily used for?',
        options: ['Sorting numbers', 'String prefix matching', 'Graph traversal', 'Matrix operations'],
        correctAnswer: 1,
        explanation: 'Tries are optimized for string operations like prefix matching and autocomplete.',
      },
      {
        id: 'q3-5',
        question: 'What is the time complexity of union operation in Union-Find with path compression?',
        options: ['O(1)', 'O(log n)', 'O(α(n))', 'O(n)'],
        correctAnswer: 2,
        explanation: 'With path compression and union by rank, operations are nearly O(1), specifically O(α(n)) where α is the inverse Ackermann function.',
      },
    ],
  };

  const defaultQuestions: QuizQuestion[] = [
    {
      id: 'default-1',
      question: 'What is an algorithm?',
      options: ['A programming language', 'A step-by-step procedure to solve a problem', 'A data structure', 'A type of computer'],
      correctAnswer: 1,
      explanation: 'An algorithm is a well-defined sequence of steps to solve a specific problem.',
    },
    {
      id: 'default-2',
      question: 'What does DSA stand for?',
      options: ['Data Science Analysis', 'Data Structures and Algorithms', 'Digital System Architecture', 'Dynamic Software Application'],
      correctAnswer: 1,
      explanation: 'DSA stands for Data Structures and Algorithms.',
    },
    {
      id: 'default-3',
      question: 'Which is NOT a linear data structure?',
      options: ['Array', 'Linked List', 'Tree', 'Queue'],
      correctAnswer: 2,
      explanation: 'Trees are hierarchical (non-linear) data structures, while arrays, linked lists, and queues are linear.',
    },
  ];

  return {
    id: `quiz-${course.id}`,
    courseId: course.id,
    courseTitle: course.title,
    title: `${course.title} Quiz`,
    description: `Test your knowledge of ${course.title}. Answer all questions to see your score.`,
    questions: quizQuestions[course.id] || defaultQuestions,
    timeLimit: 10,
    passingScore: 60,
  };
};


// Quiz List Component
const QuizList = ({ quizzes, onStartQuiz, attempts }: { 
  quizzes: Quiz[]; 
  onStartQuiz: (quiz: Quiz) => void;
  attempts: Record<string, QuizResult>;
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {quizzes.map((quiz) => {
      const attempt = attempts[quiz.id];
      const hasPassed = attempt?.passed;
      
      return (
        <Card key={quiz.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-olive-light/50 dark:bg-dark-surface-hover flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-olive dark:text-dark-accent" />
              </div>
              {attempt && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hasPassed 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {hasPassed ? 'Passed' : 'Not Passed'}
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-olive-dark dark:text-dark-text mb-1">{quiz.title}</h3>
            <p className="text-sm text-text-muted dark:text-dark-text-muted mb-4 line-clamp-2">{quiz.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-text-muted dark:text-dark-text-muted mb-4">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {quiz.questions.length} questions
              </span>
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {quiz.timeLimit} min
              </span>
            </div>

            {attempt && (
              <div className="mb-4 p-3 rounded-lg bg-olive-pale/50 dark:bg-dark-surface">
                <p className="text-sm text-olive-dark dark:text-dark-text">
                  Last Score: <span className="font-semibold">{attempt.score}%</span>
                  <span className="text-text-muted dark:text-dark-text-muted ml-2">
                    ({attempt.correctAnswers}/{attempt.totalQuestions} correct)
                  </span>
                </p>
              </div>
            )}
            
            <Button 
              onClick={() => onStartQuiz(quiz)} 
              className="w-full"
              variant={attempt ? 'outline' : 'primary'}
            >
              {attempt ? 'Retake Quiz' : 'Start Quiz'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

// Quiz Taking Component
const QuizTaking = ({ quiz, onComplete, onCancel }: { 
  quiz: Quiz; 
  onComplete: (result: QuizResult) => void;
  onCancel: () => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = useCallback(() => {
    const results = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] ?? -1,
      isCorrect: answers[q.id] === q.correctAnswer,
    }));

    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    onComplete({
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      passed: score >= quiz.passingScore,
      answers: results,
    });
  }, [answers, quiz, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-olive-dark dark:text-dark-text">{quiz.title}</h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft < 60 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-olive-light/50 dark:bg-dark-surface'
        }`}>
          <Clock className="h-5 w-5" />
          <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-olive-light/30 dark:bg-dark-surface rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-olive dark:bg-dark-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-olive-dark dark:text-dark-text mb-6">
            {question.question}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[question.id] === index
                    ? 'border-olive dark:border-dark-accent bg-olive-light/30 dark:bg-dark-surface-hover'
                    : 'border-olive-light/50 dark:border-dark-border hover:border-olive/50 dark:hover:border-dark-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    answers[question.id] === index
                      ? 'bg-olive dark:bg-dark-accent text-white dark:text-dark-bg'
                      : 'bg-olive-light/50 dark:bg-dark-surface text-olive-dark dark:text-dark-text'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-olive-dark dark:text-dark-text">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                index === currentQuestion
                  ? 'bg-olive dark:bg-dark-accent text-white dark:text-dark-bg'
                  : answers[quiz.questions[index].id] !== undefined
                  ? 'bg-olive-light dark:bg-dark-surface-hover text-olive-dark dark:text-dark-text'
                  : 'bg-olive-light/30 dark:bg-dark-surface text-text-muted dark:text-dark-text-muted'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={() => setShowConfirm(true)}>
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
          >
            Next
          </Button>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-olive-dark dark:text-dark-text mb-2">Submit Quiz?</h3>
              <p className="text-text-muted dark:text-dark-text-muted mb-4">
                You have answered {answeredCount} of {quiz.questions.length} questions.
                {answeredCount < quiz.questions.length && ' Unanswered questions will be marked as incorrect.'}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                  Review Answers
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};


// Quiz Results Component
const QuizResults = ({ quiz, result, onRetry, onBack }: { 
  quiz: Quiz; 
  result: QuizResult;
  onRetry: () => void;
  onBack: () => void;
}) => (
  <div className="max-w-3xl mx-auto">
    {/* Result Header */}
    <Card className="mb-6 overflow-hidden">
      <div className={`p-8 text-center ${
        result.passed 
          ? 'bg-gradient-to-br from-green-500 to-green-600' 
          : 'bg-gradient-to-br from-red-500 to-red-600'
      }`}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
          {result.passed ? (
            <Trophy className="h-10 w-10 text-white" />
          ) : (
            <XCircle className="h-10 w-10 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
        </h2>
        <p className="text-white/80">
          {result.passed 
            ? 'You passed the quiz!' 
            : `You need ${quiz.passingScore}% to pass. Try again!`}
        </p>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-olive-dark dark:text-dark-text">{result.score}%</p>
            <p className="text-sm text-text-muted dark:text-dark-text-muted">Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{result.correctAnswers}</p>
            <p className="text-sm text-text-muted dark:text-dark-text-muted">Correct</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{result.totalQuestions - result.correctAnswers}</p>
            <p className="text-sm text-text-muted dark:text-dark-text-muted">Incorrect</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Answer Review */}
    <h3 className="text-lg font-semibold text-olive-dark dark:text-dark-text mb-4">Answer Review</h3>
    <div className="space-y-4 mb-6">
      {quiz.questions.map((question, index) => {
        const answer = result.answers.find((a) => a.questionId === question.id);
        const isCorrect = answer?.isCorrect;
        const selectedAnswer = answer?.selectedAnswer ?? -1;

        return (
          <Card key={question.id} className={`border-l-4 ${
            isCorrect ? 'border-l-green-500' : 'border-l-red-500'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-olive-dark dark:text-dark-text mb-2">
                    {index + 1}. {question.question}
                  </p>
                  
                  <div className="space-y-1 text-sm">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : optIndex === selectedAnswer && !isCorrect
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'text-text-muted dark:text-dark-text-muted'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === question.correctAnswer && ' ✓'}
                        {optIndex === selectedAnswer && optIndex !== question.correctAnswer && ' (Your answer)'}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 p-3 bg-olive-pale/50 dark:bg-dark-surface rounded-lg">
                    <p className="text-sm text-olive-dark dark:text-dark-text">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <Button variant="outline" onClick={onBack} className="flex-1">
        <BookOpen className="h-4 w-4 mr-2" />
        Back to Quizzes
      </Button>
      <Button onClick={onRetry} className="flex-1">
        <RotateCcw className="h-4 w-4 mr-2" />
        Retake Quiz
      </Button>
    </div>
  </div>
);

// Main Quiz Page Component
export const QuizPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [attempts, setAttempts] = useState<Record<string, QuizResult>>({});
  const [quizMode, setQuizMode] = useState<'list' | 'taking' | 'results'>('list');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await apiService.getCourses();
        // Filter only enrolled courses
        const enrolled = response.data.filter((course) => course.enrolledAt);
        setEnrolledCourses(enrolled);
        
        // Load saved attempts from localStorage
        const savedAttempts = localStorage.getItem('quiz_attempts');
        if (savedAttempts) {
          setAttempts(JSON.parse(savedAttempts));
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCourses();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizResult(null);
    setQuizMode('taking');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setQuizMode('results');
    
    // Save attempt
    if (activeQuiz) {
      const newAttempts = { ...attempts, [activeQuiz.id]: result };
      setAttempts(newAttempts);
      localStorage.setItem('quiz_attempts', JSON.stringify(newAttempts));
    }
  };

  const handleRetry = () => {
    setQuizResult(null);
    setQuizMode('taking');
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setQuizMode('list');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-olive-light/30 dark:bg-dark-surface flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-olive dark:text-dark-accent" />
        </div>
        <h2 className="text-xl font-semibold text-olive-dark dark:text-dark-text mb-2">
          Authentication Required
        </h2>
        <p className="text-text-muted dark:text-dark-text-muted mb-4">
          Please log in to access quizzes.
        </p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  // Generate quizzes for enrolled courses
  const quizzes = enrolledCourses.map(generateQuizForCourse);

  return (
    <div className="space-y-6">
      {quizMode === 'list' && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-olive-dark dark:text-dark-text">Quizzes</h1>
            <p className="text-text-muted dark:text-dark-text-muted mt-1">
              Test your knowledge with quizzes from your enrolled courses
            </p>
          </div>

          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-olive-light/30 dark:bg-dark-surface flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-olive dark:text-dark-accent" />
                </div>
                <h3 className="text-lg font-semibold text-olive-dark dark:text-dark-text mb-2">
                  No Quizzes Available
                </h3>
                <p className="text-text-muted dark:text-dark-text-muted mb-4">
                  Enroll in courses to unlock quizzes and test your knowledge.
                </p>
                <Button onClick={() => navigate('/courses')}>
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} attempts={attempts} />
          )}
        </>
      )}

      {quizMode === 'taking' && activeQuiz && (
        <QuizTaking 
          quiz={activeQuiz} 
          onComplete={handleQuizComplete}
          onCancel={handleBackToList}
        />
      )}

      {quizMode === 'results' && activeQuiz && quizResult && (
        <QuizResults 
          quiz={activeQuiz} 
          result={quizResult}
          onRetry={handleRetry}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

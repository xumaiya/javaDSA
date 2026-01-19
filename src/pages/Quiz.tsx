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
  Sparkles,
} from 'lucide-react';
import { Quiz, QuizQuestion, QuizResult, Course } from '../types';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { apiService } from '../services/apiService';
import { quizService } from '../services/quizService';

// Quiz data for each course - now uses AI generation
const generateQuizForCourse = async (course: Course): Promise<Quiz> => {
  console.log('🎯 [generateQuizForCourse] Starting quiz generation for course:', course.title);
  
  // Extract topic from course title (e.g., "DSA in Java - Arrays" -> "Arrays")
  const extractTopic = (title: string): string => {
    const match = title.match(/DSA in Java - (.+)/);
    return match ? match[1] : title;
  };

  const topic = extractTopic(course.title);
  console.log('📝 [generateQuizForCourse] Extracted topic:', topic);
  
  // Generate questions using AI with medium difficulty (4 questions)
  console.log('🚀 [generateQuizForCourse] Calling quizService.generateQuizQuestions...');
  const questions = await quizService.generateQuizQuestions(
    topic,
    'intermediate', // Always use medium difficulty as requested
    4
  );

  console.log(`✅ [generateQuizForCourse] Successfully generated ${questions.length} AI questions for ${topic}`);
  console.log('📋 [generateQuizForCourse] Questions:', questions);

  return {
    id: `quiz-${course.id}`,
    courseId: course.id,
    courseTitle: course.title,
    title: `${topic} Quiz - AI Generated`,
    description: `Test your knowledge of ${topic} in Java with AI-generated medium difficulty questions.`,
    questions,
    timeLimit: 10,
    passingScore: 60,
  };
};

// Fallback questions if AI generation fails
const getFallbackQuestions = (topic: string): QuizQuestion[] => {
  const fallbackMap: Record<string, QuizQuestion[]> = {
    'Arrays': [
      {
        id: 'q1',
        question: 'What is an array in Java?',
        options: [
          'A collection of different data types',
          'A fixed-size collection of elements of the same type',
          'A dynamic list that can grow',
          'A type of loop'
        ],
        correctAnswer: 1,
        explanation: 'An array in Java is like a row of numbered boxes that can only hold one type of thing (like all integers or all strings). Once you create it, the size stays the same!',
      },
      {
        id: 'q2',
        question: 'How do you access the first element of an array in Java?',
        options: ['array[1]', 'array[0]', 'array.first()', 'array.get(0)'],
        correctAnswer: 1,
        explanation: 'In Java, arrays start counting from 0, not 1! So the first element is at position 0, like the ground floor of a building.',
      },
      {
        id: 'q3',
        question: 'What happens if you try to access array[10] in an array of size 5?',
        options: [
          'It returns 0',
          'It returns null',
          'It throws ArrayIndexOutOfBoundsException',
          'It automatically expands the array'
        ],
        correctAnswer: 2,
        explanation: 'Java throws an error called ArrayIndexOutOfBoundsException - it\'s like trying to open locker number 10 when there are only 5 lockers!',
      },
    ],
    'Linked Lists': [
      {
        id: 'q1',
        question: 'What is a linked list?',
        options: [
          'An array with links',
          'A chain of nodes where each node points to the next',
          'A list stored in a file',
          'A sorted array'
        ],
        correctAnswer: 1,
        explanation: 'A linked list is like a treasure hunt where each clue (node) tells you where the next clue is. Each piece of data knows where to find the next piece!',
      },
      {
        id: 'q2',
        question: 'What does each node in a singly linked list contain?',
        options: [
          'Only data',
          'Data and a link to the next node',
          'Data and links to previous and next nodes',
          'Just a link'
        ],
        correctAnswer: 1,
        explanation: 'Each node in a singly linked list has two parts: the data it stores and a pointer (like an arrow) showing where the next node is.',
      },
      {
        id: 'q3',
        question: 'What is the advantage of linked lists over arrays?',
        options: [
          'Faster access to elements',
          'Uses less memory',
          'Can easily grow and shrink',
          'Better for sorting'
        ],
        correctAnswer: 2,
        explanation: 'Linked lists can easily grow bigger or smaller - like adding or removing train cars. Arrays have a fixed size once created!',
      },
    ],
  };

  return fallbackMap[topic] || fallbackMap['Arrays'];
};


// Quiz List Component
const QuizList = ({ quizzes, onStartQuiz, attempts, onGenerateQuiz, generatingQuizId }: { 
  quizzes: Quiz[]; 
  onStartQuiz: (quiz: Quiz) => void;
  attempts: Record<string, QuizResult>;
  onGenerateQuiz: (courseId: string) => void;
  generatingQuizId: string | null;
}) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {quizzes.map((quiz, index) => {
      const attempt = attempts[quiz.id];
      const hasPassed = attempt?.passed;
      const isGenerating = generatingQuizId === quiz.courseId;
      
      return (
        <Card 
          key={quiz.id} 
          className="backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 border-olive-light/30 dark:border-dark-border/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 flex items-center justify-center shadow-lg">
                {isGenerating ? (
                  <Loader size="sm" />
                ) : (
                  <ClipboardList className="h-7 w-7 text-white" />
                )}
              </div>
              {attempt && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                  hasPassed 
                    ? 'bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-700' 
                    : 'bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-700'
                }`}>
                  {hasPassed ? '✓ Passed' : '✗ Not Passed'}
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg text-olive-dark dark:text-dark-text mb-2">{quiz.title}</h3>
            <p className="text-sm text-text-muted dark:text-dark-text-muted mb-4 line-clamp-2">{quiz.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-text-muted dark:text-dark-text-muted mb-4 p-3 rounded-xl backdrop-blur-sm bg-olive-pale/30 dark:bg-dark-bg/30">
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4 text-olive dark:text-dark-accent" />
                {quiz.questions.length} questions
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-olive dark:text-dark-accent" />
                {quiz.timeLimit} min
              </span>
            </div>

            {attempt && (
              <div className="mb-4 p-4 rounded-xl backdrop-blur-sm bg-olive-pale/50 dark:bg-dark-surface/50 border border-olive-light/30 dark:border-dark-border/50">
                <p className="text-sm text-olive-dark dark:text-dark-text">
                  Last Score: <span className="font-bold text-lg">{attempt.score}%</span>
                  <span className="text-text-muted dark:text-dark-text-muted ml-2">
                    ({attempt.correctAnswers}/{attempt.totalQuestions} correct)
                  </span>
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={() => onStartQuiz(quiz)} 
                className={`flex-1 ${attempt ? 'backdrop-blur-sm bg-white/50 dark:bg-dark-surface/50 hover:bg-white/80 dark:hover:bg-dark-surface/80' : 'bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 shadow-lg'} hover:scale-105 transition-all duration-300`}
                variant={attempt ? 'outline' : 'primary'}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader size="sm" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  <>
                    {attempt ? 'Retake Quiz' : 'Start Quiz'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
              <Button
                onClick={() => onGenerateQuiz(quiz.courseId)}
                variant="ghost"
                size="sm"
                disabled={isGenerating}
                className="px-3 hover:bg-olive-light/30 dark:hover:bg-dark-surface-hover"
                title={isGenerating ? "Generating new questions..." : "Generate new AI questions"}
              >
                {isGenerating ? (
                  <Loader size="sm" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

// Quiz Taking Component
const QuizTaking = ({ quiz, onComplete }: { 
  quiz: Quiz; 
  onComplete: (result: QuizResult) => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(quiz.timeLimit * 60);
    setShowResetConfirm(false);
  };

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
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            className="text-text-muted hover:text-olive dark:text-dark-text-muted dark:hover:text-dark-accent"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 60 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-olive-light/50 dark:bg-dark-surface'
          }`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
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

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-olive-dark dark:text-dark-text mb-2">Reset Quiz?</h3>
              <p className="text-text-muted dark:text-dark-text-muted mb-4">
                This will clear all your answers and restart the timer. Are you sure?
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowResetConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleReset} variant="primary" className="flex-1">
                  Reset Quiz
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
  const { isAuthenticated, user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [attempts, setAttempts] = useState<Record<string, QuizResult>>({});
  const [quizMode, setQuizMode] = useState<'list' | 'taking' | 'results'>('list');
  const [generatingQuizId, setGeneratingQuizId] = useState<string | null>(null);

  // Get user-specific storage key for quiz attempts
  const getQuizAttemptsKey = () => {
    return user ? `quiz_attempts_${user.id}` : 'quiz_attempts';
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await apiService.getCourses();
        // Filter only enrolled courses
        const enrolled = response.data.filter((course) => course.enrolledAt);
        console.log('📚 [loadCourses] Found enrolled courses:', enrolled.length);
        setEnrolledCourses(enrolled);
        
        // Load saved attempts from user-specific localStorage
        const attemptsKey = getQuizAttemptsKey();
        const savedAttempts = localStorage.getItem(attemptsKey);
        if (savedAttempts) {
          setAttempts(JSON.parse(savedAttempts));
        }

        // Generate quizzes for enrolled courses with AI
        if (enrolled.length > 0) {
          console.log('🚀 [loadCourses] Generating quizzes for', enrolled.length, 'courses...');
          setLoading(true);
          const generatedQuizzes = await Promise.all(
            enrolled.map(course => generateQuizForCourse(course))
          );
          console.log('✅ [loadCourses] Generated', generatedQuizzes.length, 'quizzes');
          setQuizzes(generatedQuizzes);
        } else {
          console.log('⚠️ [loadCourses] No enrolled courses found');
        }
      } catch (error) {
        console.error('💥 [loadCourses] Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      console.log('✅ [useEffect] User is authenticated, loading courses...');
      loadCourses();
    } else {
      console.log('⚠️ [useEffect] User not authenticated');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleGenerateNewQuiz = async (courseId: string) => {
    console.log('🔄 [handleGenerateNewQuiz] Generating new quiz for course:', courseId);
    setGeneratingQuizId(courseId);
    try {
      const course = enrolledCourses.find(c => c.id === courseId);
      if (!course) {
        console.error('❌ [handleGenerateNewQuiz] Course not found:', courseId);
        return;
      }

      console.log('📚 [handleGenerateNewQuiz] Found course:', course.title);
      
      // Generate fresh quiz with AI
      const newQuiz = await generateQuizForCourse(course);
      setQuizzes(prev => prev.map(q => q.courseId === courseId ? newQuiz : q));
      
      console.log('✅ [handleGenerateNewQuiz] Successfully generated new quiz for', course.title);
    } catch (error) {
      console.error('💥 [handleGenerateNewQuiz] Failed to generate new quiz:', error);
      alert(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck console for details.`);
    } finally {
      setGeneratingQuizId(null);
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizResult(null);
    setQuizMode('taking');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setQuizMode('results');
    
    // Save attempt to user-specific storage
    if (activeQuiz) {
      const attemptsKey = getQuizAttemptsKey();
      const newAttempts = { ...attempts, [activeQuiz.id]: result };
      setAttempts(newAttempts);
      localStorage.setItem(attemptsKey, JSON.stringify(newAttempts));
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

  return (
    <div className="space-y-6">
      {quizMode === 'list' && (
        <>
          {/* Header with Glass Morphism */}
          <div className="p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-r from-white/60 to-olive-pale/40 dark:from-dark-surface/60 dark:to-dark-bg/60 border border-olive-light/30 dark:border-dark-border/50 shadow-xl">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent">
              Quizzes
            </h1>
            <p className="text-text-muted dark:text-dark-text-muted mt-2">
              Test your knowledge with AI-generated quizzes from your enrolled DSA in Java courses
            </p>
          </div>

          {quizzes.length === 0 ? (
            <Card className="backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 border-olive-light/30 dark:border-dark-border/50 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-olive-light/50 to-olive/30 dark:from-dark-surface dark:to-dark-surface-hover flex items-center justify-center animate-float-slow">
                  <BookOpen className="h-10 w-10 text-olive dark:text-dark-accent" />
                </div>
                <h3 className="text-xl font-bold text-olive-dark dark:text-dark-text mb-2">
                  No Quizzes Available
                </h3>
                <p className="text-text-muted dark:text-dark-text-muted mb-6">
                  Enroll in DSA in Java courses to unlock AI-powered quizzes and test your knowledge.
                </p>
                <Button 
                  onClick={() => navigate('/courses')}
                  className="bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 hover:scale-105 shadow-lg transition-all duration-300"
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader size="lg" />
                <p className="mt-4 text-text-muted dark:text-dark-text-muted">
                  Generating AI-powered quiz questions...
                </p>
              </div>
            </div>
          ) : (
            <QuizList 
              quizzes={quizzes} 
              onStartQuiz={handleStartQuiz} 
              attempts={attempts}
              onGenerateQuiz={handleGenerateNewQuiz}
              generatingQuizId={generatingQuizId}
            />
          )}
        </>
      )}

      {quizMode === 'taking' && activeQuiz && (
        <QuizTaking 
          quiz={activeQuiz} 
          onComplete={handleQuizComplete}
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

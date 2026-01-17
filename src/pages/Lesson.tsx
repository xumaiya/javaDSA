import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Lesson as LessonType, Chapter as ChapterType } from '../types';
import { apiService } from '../services/apiService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useNotes } from '../hooks/useNotes';
import { useAuthStore } from '../store/authStore';

export const Lesson = () => {
  const { courseId, chapterId, lessonId } = useParams<{
    courseId: string;
    chapterId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { notes } = useNotes(lessonId);
  const { isLessonCompleted, addCompletedLesson } = useAuthStore();

  // Check if lesson is completed from auth store (backend-synced)
  const isCompleted = lessonId ? isLessonCompleted(lessonId) : false;

  useEffect(() => {
    if (!courseId || !chapterId || !lessonId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both lesson and chapter data in parallel
        const [lessonResponse, chapterResponse] = await Promise.all([
          apiService.getLessonById(courseId, chapterId, lessonId),
          apiService.getChapterById(courseId, chapterId),
        ]);
        setLesson(lessonResponse.data);
        setChapter(chapterResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, chapterId, lessonId]);

  // Calculate navigation state based on current lesson position in chapter
  const navigation = useMemo(() => {
    if (!chapter || !lessonId) {
      return { previousLesson: null, nextLesson: null, currentIndex: -1, totalLessons: 0 };
    }

    const lessons = chapter.lessons;
    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    
    return {
      previousLesson: currentIndex > 0 ? lessons[currentIndex - 1] : null,
      nextLesson: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
      currentIndex,
      totalLessons: lessons.length,
    };
  }, [chapter, lessonId]);

  const handleNavigatePrevious = () => {
    if (navigation.previousLesson && courseId && chapterId) {
      navigate(`/courses/${courseId}/chapters/${chapterId}/lessons/${navigation.previousLesson.id}`);
    }
  };

  const handleNavigateNext = () => {
    if (navigation.nextLesson && courseId && chapterId) {
      navigate(`/courses/${courseId}/chapters/${chapterId}/lessons/${navigation.nextLesson.id}`);
    }
  };

  const handleComplete = async () => {
    if (!lessonId) return;
    setIsCompleting(true);
    try {
      // Persist to backend first
      await apiService.completeLessonOnBackend(lessonId);
      
      // Update local auth store
      const numericLessonId = parseInt(lessonId, 10);
      addCompletedLesson(numericLessonId);
      
      // Also update mock API for local state consistency
      await apiService.completeLesson(lessonId);
      
      if (lesson) {
        setLesson({ ...lesson, completed: true });
      }
    } catch (err) {
      // If backend fails, still try to update local state
      try {
        await apiService.completeLesson(lessonId);
        if (lesson) {
          setLesson({ ...lesson, completed: true });
        }
      } catch {
        alert('Failed to mark lesson as complete');
      }
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="space-y-4">
        <Link
          to={`/courses/${courseId}/chapters/${chapterId}`}
          className="flex items-center text-olive hover:text-olive-dark dark:text-olive-light"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Chapter
        </Link>
        <Card>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                {error || 'Lesson not found'}
              </p>
              <p className="text-text-light dark:text-gray-400">
                The lesson you're looking for doesn't exist or may have been removed.
              </p>
              <Link to={`/courses/${courseId}/chapters/${chapterId}`}>
                <Button variant="primary">Back to Chapter</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use backend-synced completion status or local lesson state
  const lessonCompleted = isCompleted || lesson.completed;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${courseId}/chapters/${chapterId}`}
          className="flex items-center text-olive hover:text-olive-dark dark:text-olive-light"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Chapter
        </Link>
        <div className="flex items-center space-x-2">
          <Link to="/notes">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Notes ({notes.length})
            </Button>
          </Link>
          {!lessonCompleted && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleComplete}
              isLoading={isCompleting}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          )}
          {lessonCompleted && (
            <span className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5 mr-1" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold text-olive-dark dark:text-olive-light mb-4">
            {lesson.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4 border-t border-olive-light dark:border-olive-dark">
        <Button 
          variant="outline" 
          onClick={handleNavigatePrevious}
          disabled={!navigation.previousLesson}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-text-light dark:text-olive-light self-center">
          {navigation.currentIndex + 1} of {navigation.totalLessons}
        </span>
        <Button 
          variant="outline"
          onClick={handleNavigateNext}
          disabled={!navigation.nextLesson}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};


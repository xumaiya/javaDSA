import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Lock, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Chapter as ChapterType } from '../types';
import { apiService } from '../services/apiService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const Chapter = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !chapterId) return;

    const fetchChapter = async () => {
      try {
        setLoading(true);
        const response = await apiService.getChapterById(courseId, chapterId);
        setChapter(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chapter');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [courseId, chapterId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="space-y-4">
        <Link
          to={`/courses/${courseId}`}
          className="text-olive hover:text-olive-dark dark:text-olive-light inline-block"
        >
          ← Back to Course
        </Link>
        <Card>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                {error || 'Chapter not found'}
              </p>
              <p className="text-text-light dark:text-gray-400">
                The chapter you're looking for doesn't exist or may have been removed.
              </p>
              <Link to={`/courses/${courseId}`}>
                <Button variant="primary">Back to Course</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/courses/${courseId}`}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4 inline-block"
        >
          ← Back to Course
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{chapter.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{chapter.description}</p>
      </div>

      {/* Progress */}
      {chapter.progress > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Chapter Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{chapter.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${chapter.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lessons */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Lessons</h2>
        <div className="space-y-3">
          {chapter.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}`}
            >
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : lesson.unlocked ? (
                        <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {lesson.duration} minutes
                        </p>
                      </div>
                    </div>
                    {lesson.completed && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};


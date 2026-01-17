import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Lock } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { DIFFICULTY_COLORS } from '../utils/constants';

export const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { course, loading, error } = useCourse(courseId || '');

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <Link to="/courses" className="text-olive hover:text-olive-dark dark:text-olive-light inline-block">
          ← Back to Courses
        </Link>
        <Card>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                {error || 'Course not found'}
              </p>
              <p className="text-text-light dark:text-gray-400">
                The course you're looking for doesn't exist or may have been removed.
              </p>
              <Link to="/courses">
                <Button variant="primary">Browse All Courses</Button>
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
        <Link to="/courses" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4 inline-block">
          ← Back to Courses
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{course.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration} minutes
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {course.chapters.length} chapters
          </div>
        </div>
      </div>

      {/* Progress */}
      {course.enrolledAt && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapters */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Chapters</h2>
        <div className="space-y-4">
          {course.chapters.map((chapter) => (
            <Link key={chapter.id} to={`/courses/${courseId}/chapters/${chapter.id}`}>
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {chapter.unlocked ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {chapter.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {chapter.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {chapter.lessons.length} lessons
                        </span>
                        {chapter.progress > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {chapter.progress}% complete
                            </span>
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                                style={{ width: `${chapter.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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


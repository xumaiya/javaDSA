import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, TrendingUp, Search } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { DIFFICULTY_COLORS } from '../utils/constants';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';

export const Courses = () => {
  const { courses, loading, refetch } = useCourses();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to enroll in courses');
      return;
    }
    try {
      await apiService.enrollInCourse(courseId);
      alert('Successfully enrolled!');
      refetch();
    } catch {
      alert('Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-olive-dark dark:text-dark-text">Courses</h1>
        <p className="text-text-light dark:text-dark-text-muted mt-2">
          Explore our comprehensive DSA courses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-olive-light dark:text-dark-text-muted h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
            <Button
              key={difficulty}
              variant={difficultyFilter === difficulty ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter(difficulty)}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card hover className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className="h-6 w-6 text-olive dark:text-dark-accent mt-1" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-text-light dark:text-dark-text-muted mb-4 line-clamp-3 flex-1">
                    {course.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-text-light dark:text-dark-text-muted">
                      <Clock className="h-4 w-4 mr-2" />
                      {course.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-text-light dark:text-dark-text-muted">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {course.chapters.length} chapters
                    </div>
                    {course.enrolledAt ? (
                      <div className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-light dark:text-dark-text-muted">Progress</span>
                          <span className="font-medium text-olive-dark dark:text-dark-text">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-olive-light dark:bg-dark-border rounded-full h-2">
                          <div
                            className="bg-olive dark:bg-dark-accent h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full mt-2"
                        onClick={(e) => handleEnroll(course.id, e)}
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-olive-light dark:text-dark-text-muted mx-auto mb-4" />
            <p className="text-text-light dark:text-dark-text-muted">
              No courses found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


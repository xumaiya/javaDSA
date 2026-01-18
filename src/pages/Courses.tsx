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
      {/* Header with Glass Morphism */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-r from-white/60 to-olive-pale/40 dark:from-dark-surface/60 dark:to-dark-bg/60 border border-olive-light/30 dark:border-dark-border/50 shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent">
          Courses
        </h1>
        <p className="text-text-light dark:text-dark-text-muted mt-2">
          Explore our comprehensive DSA courses
        </p>
      </div>

      {/* Filters with Glass Morphism */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-dark-surface/50 border border-olive-light/30 dark:border-dark-border/50 shadow-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-olive-light dark:text-dark-text-muted h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 backdrop-blur-sm bg-white/70 dark:bg-dark-bg/70 border-olive-light/50 dark:border-dark-border"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
            <Button
              key={difficulty}
              variant={difficultyFilter === difficulty ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter(difficulty)}
              className={difficultyFilter === difficulty ? 'shadow-lg scale-105' : 'backdrop-blur-sm bg-white/50 dark:bg-dark-surface/50 hover:scale-105'}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Courses Grid with Enhanced Cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="group">
              <Card 
                hover 
                className="h-full flex flex-col backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 border-olive-light/30 dark:border-dark-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${DIFFICULTY_COLORS[course.difficulty]}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-olive dark:group-hover:text-dark-accent transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-text-light dark:text-dark-text-muted mb-4 line-clamp-3 flex-1">
                    {course.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-text-light dark:text-dark-text-muted">
                      <Clock className="h-4 w-4 mr-2 text-olive dark:text-dark-accent" />
                      {course.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-text-light dark:text-dark-text-muted">
                      <TrendingUp className="h-4 w-4 mr-2 text-olive dark:text-dark-accent" />
                      {course.chapters.length} chapters
                    </div>
                    {course.enrolledAt ? (
                      <div className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-light dark:text-dark-text-muted">Progress</span>
                          <span className="font-medium text-olive-dark dark:text-dark-text">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-olive-light/30 dark:bg-dark-border rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full mt-2 bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 hover:scale-105 shadow-lg"
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
        <Card className="backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 border-olive-light/30 dark:border-dark-border/50 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-olive-light/30 dark:bg-dark-surface flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-olive-light dark:text-dark-text-muted" />
            </div>
            <p className="text-text-light dark:text-dark-text-muted">
              No courses found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


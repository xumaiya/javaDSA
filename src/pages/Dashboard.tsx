import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Flame, TrendingUp, Award } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCourses } from '../hooks/useCourses';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { courses, loading } = useCourses();

  const enrolledCourses = courses.filter(c => c.enrolledAt);
  const totalProgress = enrolledCourses.length > 0
    ? enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-olive-dark dark:text-dark-text">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-text-light dark:text-dark-text-muted mt-2">
          Continue your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Total Points</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {user?.points || 0}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-olive dark:text-dark-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Current Streak</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {user?.streak || 0} days
                </p>
              </div>
              <Flame className="h-8 w-8 text-olive dark:text-dark-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Level</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {user?.level || 1}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-olive dark:text-dark-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Avg. Progress</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {Math.round(totalProgress)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-olive dark:text-dark-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-2xl font-semibold text-olive-dark dark:text-dark-text mb-4">
          Your Courses
        </h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card hover>
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-5 w-5 text-olive dark:text-dark-accent" />
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-light dark:text-dark-text-muted mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-light dark:text-dark-text-muted">Progress</span>
                        <span className="font-medium text-olive-dark dark:text-dark-text">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-olive-light dark:bg-dark-border rounded-full h-2">
                        <div
                          className="bg-olive dark:bg-dark-accent h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
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
              <p className="text-text-light dark:text-dark-text-muted mb-4">
                You haven't enrolled in any courses yet
              </p>
              <Link to="/courses">
                <button className="text-olive hover:text-olive-dark dark:text-dark-accent dark:hover:text-green-300 font-medium">
                  Browse Courses
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Flame, TrendingUp, Award, Target, Zap, Brain, Code2, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCourses } from '../hooks/useCourses';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { useEffect, useState } from 'react';
import { apiService, UserStatsResponse } from '../services/apiService';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { courses, loading } = useCourses();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Fetch user stats from backend
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching user stats...');
        const response = await apiService.getUserStats();
        console.log('✅ Stats loaded:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('❌ Failed to load stats:', error);
        // Use fallback stats
        setStats({
          points: user?.points || 0,
          streak: user?.streak || 0,
          level: user?.level || 1,
          completedLessonsCount: 0,
          enrolledCoursesCount: 0,
          averageProgress: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          pointsThisWeek: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  const enrolledCourses = courses.filter(c => c.enrolledAt);
  const totalProgress = enrolledCourses.length > 0
    ? enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
    : 0;

  if (loading || statsLoading) {
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

  // Use stats from backend, fallback to user object
  const displayPoints = stats?.points ?? user?.points ?? 0;
  const displayStreak = stats?.streak ?? user?.streak ?? 0;
  const displayLevel = stats?.level ?? user?.level ?? 1;
  const displayPointsThisWeek = stats?.pointsThisWeek ?? 50;
  const weeklyActivityData = stats?.weeklyActivity ?? [40, 65, 45, 80, 55, 90, 70];

  return (
    <div className="space-y-8 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-olive/5 dark:bg-olive/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-olive-light/10 dark:bg-olive-light/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-olive/5 dark:bg-olive/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Welcome Header with Animation */}
      <div className={`relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-olive-dark dark:text-dark-text flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-olive dark:text-dark-accent animate-pulse" />
              Welcome back, {user?.username}!
            </h1>
            <p className="text-text-light dark:text-dark-text-muted mt-2 text-lg">
              Continue your learning journey • Level {user?.level || 1}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-olive/20 dark:bg-olive/30 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-olive to-olive-dark dark:from-dark-accent dark:to-green-600 p-6 rounded-full">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Morphism Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Total Points Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-olive-light/20 dark:from-olive/30 dark:to-olive-light/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
          <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light dark:text-dark-text-muted flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Total Points
                  </p>
                  <p className="text-3xl font-bold text-olive-dark dark:text-dark-text mt-2 animate-pulse">
                    {displayPoints}
                  </p>
                  <p className="text-xs text-olive dark:text-dark-accent mt-1">+{displayPointsThisWeek} this week</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-olive/20 dark:bg-olive/30 rounded-full blur-md animate-pulse" />
                  <Trophy className="relative h-12 w-12 text-olive dark:text-dark-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-500/30 dark:to-red-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
          <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light dark:text-dark-text-muted flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold text-olive-dark dark:text-dark-text mt-2">
                    {displayStreak} <span className="text-lg">days</span>
                  </p>
                  <p className="text-xs text-olive dark:text-dark-accent mt-1">{displayStreak > 0 ? 'Keep it up! 🔥' : 'Start your streak!'}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400/30 dark:bg-orange-500/40 rounded-full blur-md animate-pulse" />
                  <Flame className="relative h-12 w-12 text-orange-500 dark:text-orange-400 animate-bounce" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 dark:from-purple-500/30 dark:to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
          <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light dark:text-dark-text-muted flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Level
                  </p>
                  <p className="text-3xl font-bold text-olive-dark dark:text-dark-text mt-2">
                    {displayLevel}
                  </p>
                  <p className="text-xs text-olive dark:text-dark-accent mt-1">Next: {(displayLevel + 1) * 100} pts</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400/30 dark:bg-purple-500/40 rounded-full blur-md animate-pulse" />
                  <TrendingUp className="relative h-12 w-12 text-purple-500 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-green-500/30 dark:to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
          <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light dark:text-dark-text-muted flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Avg. Progress
                  </p>
                  <p className="text-3xl font-bold text-olive-dark dark:text-dark-text mt-2">
                    {Math.round(totalProgress)}%
                  </p>
                  <p className="text-xs text-olive dark:text-dark-accent mt-1">{enrolledCourses.length} courses</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400/30 dark:bg-green-500/40 rounded-full blur-md animate-pulse" />
                  <Award className="relative h-12 w-12 text-green-500 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Graph - Glass Morphism */}
      <div className={`transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-olive-light/10 dark:from-olive/20 dark:to-olive-light/5 rounded-2xl blur-xl" />
          <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-olive dark:text-dark-accent" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-2">
                {weeklyActivityData.map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-olive to-olive-light dark:from-dark-accent dark:to-green-400 rounded-t-lg transition-all duration-500 hover:scale-105 cursor-pointer relative group/bar"
                      style={{ 
                        height: `${Math.max(5, height)}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-lg" />
                    </div>
                    <span className="text-xs text-text-muted dark:text-dark-text-muted">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enrolled Courses with Glass Morphism */}
      <div className={`transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-2xl font-semibold text-olive-dark dark:text-dark-text mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-olive dark:text-dark-accent" />
          Your Courses
        </h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <div 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-olive-light/20 dark:from-olive/30 dark:to-olive-light/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-2 bg-olive/10 dark:bg-olive/20 rounded-lg">
                          <BookOpen className="h-5 w-5 text-olive dark:text-dark-accent" />
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-text-light dark:text-dark-text-muted mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-light dark:text-dark-text-muted">Progress</span>
                          <span className="font-bold text-olive-dark dark:text-dark-text">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="relative w-full bg-olive-light/30 dark:bg-dark-border rounded-full h-3 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${course.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-muted dark:text-dark-text-muted">
                          <span>{course.difficulty}</span>
                          <span>{course.duration}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-olive-light/10 dark:from-olive/20 dark:to-olive-light/5 rounded-2xl blur-xl" />
            <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border">
              <CardContent className="text-center py-12">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-olive/20 dark:bg-olive/30 rounded-full blur-xl animate-pulse" />
                  <BookOpen className="relative h-16 w-16 text-olive-light dark:text-dark-text-muted mx-auto mb-4" />
                </div>
                <p className="text-text-light dark:text-dark-text-muted mb-6 text-lg">
                  You haven't enrolled in any courses yet
                </p>
                <Link to="/courses">
                  <button className="px-6 py-3 bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-600 text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Browse Courses
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { User, Trophy, Flame, TrendingUp, Award } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCourses } from '../hooks/useCourses';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { courses } = useCourses();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  const enrolledCourses = courses.filter((c) => c.enrolledAt);
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100);

  const handleSave = () => {
    if (user) {
      updateUser({ username, email });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-text-light dark:text-dark-text-muted">Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Glass Morphism */}
      <div className="flex items-center justify-between p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-r from-white/60 to-olive-pale/40 dark:from-dark-surface/60 dark:to-dark-bg/60 border border-olive-light/30 dark:border-dark-border/50 shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent">
          Profile
        </h1>
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(true)}
          className="backdrop-blur-sm bg-white/50 dark:bg-dark-surface/50 hover:scale-105 shadow-lg transition-all duration-300"
        >
          Edit Profile
        </Button>
      </div>

      {/* Profile Info with Glass Morphism */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 border-olive-light/30 dark:border-dark-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-olive dark:text-dark-accent" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl backdrop-blur-sm bg-olive-pale/30 dark:bg-dark-bg/30">
              <label className="block text-sm font-medium text-olive-dark dark:text-dark-text mb-1">
                Username
              </label>
              <p className="text-lg font-semibold text-olive-dark dark:text-dark-text">{user.username}</p>
            </div>
            <div className="p-4 rounded-2xl backdrop-blur-sm bg-olive-pale/30 dark:bg-dark-bg/30">
              <label className="block text-sm font-medium text-olive-dark dark:text-dark-text mb-1">
                Email
              </label>
              <p className="text-lg font-semibold text-olive-dark dark:text-dark-text">{user.email}</p>
            </div>
            <div className="p-4 rounded-2xl backdrop-blur-sm bg-olive-pale/30 dark:bg-dark-bg/30">
              <label className="block text-sm font-medium text-olive-dark dark:text-dark-text mb-1">
                Member Since
              </label>
              <p className="text-lg font-semibold text-olive-dark dark:text-dark-text">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-white/60 to-olive-pale/40 dark:from-dark-surface/60 dark:to-dark-bg/60 border-olive-light/30 dark:border-dark-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardContent className="pt-6 text-center">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-olive via-olive-dark to-olive dark:from-dark-accent dark:via-green-500 dark:to-dark-accent flex items-center justify-center mx-auto mb-4 shadow-2xl animate-float-slow">
              <User className="h-14 w-14 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent">
              {user.username}
            </h3>
            <div className="mt-2 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm bg-olive-light/50 dark:bg-dark-surface/50">
              <p className="text-sm font-medium text-olive-dark dark:text-dark-text">Level {user.level}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats with Glass Morphism and Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-50/80 to-white/60 dark:from-yellow-900/20 dark:to-dark-surface/60 border-yellow-200/50 dark:border-yellow-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted mb-1">Total Points</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-400 dark:to-yellow-300 bg-clip-text text-transparent">
                  {user.points}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg animate-float-slow">
                <Trophy className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-orange-50/80 to-white/60 dark:from-orange-900/20 dark:to-dark-surface/60 border-orange-200/50 dark:border-orange-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in delay-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted mb-1">Current Streak</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent">
                  {user.streak} days
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg animate-float-slow delay-300">
                <Flame className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-olive-pale/80 to-white/60 dark:from-green-900/20 dark:to-dark-surface/60 border-olive-light/50 dark:border-green-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in delay-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-accent dark:to-green-400 bg-clip-text text-transparent">
                  {enrolledCourses.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 flex items-center justify-center shadow-lg animate-float-slow delay-500">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-green-50/80 to-white/60 dark:from-green-900/20 dark:to-dark-surface/60 border-green-200/50 dark:border-green-700/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-fade-in delay-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted mb-1">Completed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                  {completedCourses.length}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg animate-float-slow delay-700">
                <Award className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization with Glass Morphism */}
      <Card className="backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 border-olive-light/30 dark:border-dark-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-olive dark:text-dark-accent" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrolledCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="p-4 rounded-2xl backdrop-blur-sm bg-olive-pale/30 dark:bg-dark-bg/30 hover:bg-olive-pale/50 dark:hover:bg-dark-bg/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-olive-dark dark:text-dark-text">{course.title}</span>
                  <span className="text-text-light dark:text-dark-text-muted font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-olive-light/30 dark:bg-dark-border rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-olive-light/30 dark:bg-dark-surface flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-olive-light dark:text-dark-text-muted" />
                </div>
                <p className="text-center text-text-light dark:text-dark-text-muted">
                  No enrolled courses yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <div className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


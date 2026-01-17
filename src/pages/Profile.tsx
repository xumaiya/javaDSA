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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-dark dark:text-dark-text">Profile</h1>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-dark dark:text-dark-text mb-1">
                Username
              </label>
              <p className="text-olive-dark dark:text-dark-text-muted">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-dark dark:text-dark-text mb-1">
                Email
              </label>
              <p className="text-olive-dark dark:text-dark-text-muted">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-dark dark:text-dark-text mb-1">
                Member Since
              </label>
              <p className="text-olive-dark dark:text-dark-text-muted">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-24 h-24 rounded-full bg-olive-light dark:bg-dark-surface-hover flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-olive-dark dark:text-dark-text" />
            </div>
            <h3 className="text-lg font-semibold text-olive-dark dark:text-dark-text">
              {user.username}
            </h3>
            <p className="text-sm text-text-light dark:text-dark-text-muted">Level {user.level}</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Total Points</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {user.points}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Current Streak</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {user.streak} days
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-dark-text-muted">Enrolled Courses</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {enrolledCourses.length}
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
                <p className="text-sm text-text-light dark:text-dark-text-muted">Completed</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-dark-text">
                  {completedCourses.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-olive-dark dark:text-dark-text">{course.title}</span>
                  <span className="text-text-light dark:text-dark-text-muted">{course.progress}%</span>
                </div>
                <div className="w-full bg-olive-light/30 dark:bg-dark-border rounded-full h-2">
                  <div
                    className="bg-olive dark:bg-dark-accent h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && (
              <p className="text-center text-text-light dark:text-dark-text-muted py-4">
                No enrolled courses yet
              </p>
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


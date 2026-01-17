import { ReactNode, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/apiService';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, setCompletedLessonIds, completedLessonIds } = useAuthStore();
  const hasFetchedProgress = useRef(false);

  // Fetch user progress from backend when authenticated
  useEffect(() => {
    const fetchProgress = async () => {
      if (isAuthenticated && !hasFetchedProgress.current && completedLessonIds.length === 0) {
        hasFetchedProgress.current = true;
        try {
          const response = await apiService.getUserProgress();
          setCompletedLessonIds(response.data.completedLessonIds);
        } catch (error) {
          // Silently fail - progress will be empty but app continues to work
          console.error('Failed to fetch user progress:', error);
        }
      }
    };

    fetchProgress();
  }, [isAuthenticated, setCompletedLessonIds, completedLessonIds.length]);

  // Reset the fetch flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasFetchedProgress.current = false;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};








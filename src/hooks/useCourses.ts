import { useState, useEffect } from 'react';
import { Course } from '../types';
import { apiService } from '../services/apiService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getCourses();
        setCourses(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: () => {
    setLoading(true);
    apiService.getCourses().then(response => {
      setCourses(response.data);
      setLoading(false);
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      setLoading(false);
    });
  }};
};








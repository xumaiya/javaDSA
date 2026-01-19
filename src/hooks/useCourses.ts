import { useState, useEffect } from 'react';
import { Course } from '../types';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';

/**
 * Calculate course progress based on completed lessons.
 * Progress = (completed lessons in course / total lessons in course) * 100
 */
const calculateCourseProgress = (course: Course, completedLessonIds: number[]): number => {
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  if (totalLessons === 0) return 0;
  
  const completedLessons = course.chapters.reduce((sum, ch) => {
    return sum + ch.lessons.filter(lesson => {
      const numericId = parseInt(lesson.id.split('-').pop() || '0', 10);
      return completedLessonIds.includes(numericId);
    }).length;
  }, 0);
  
  return Math.round((completedLessons / totalLessons) * 100);
};

/**
 * Calculate chapter progress based on completed lessons.
 * Progress = (completed lessons in chapter / total lessons in chapter) * 100
 */
const calculateChapterProgress = (lessons: any[], completedLessonIds: number[]): number => {
  if (lessons.length === 0) return 0;
  
  const completedCount = lessons.filter(lesson => {
    const numericId = parseInt(lesson.id.split('-').pop() || '0', 10);
    return completedLessonIds.includes(numericId);
  }).length;
  
  return Math.round((completedCount / lessons.length) * 100);
};

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { completedLessonIds } = useAuthStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getCourses();
        
        // Calculate dynamic progress for each course and chapter
        const coursesWithProgress = response.data.map(course => ({
          ...course,
          progress: calculateCourseProgress(course, completedLessonIds),
          chapters: course.chapters.map(chapter => ({
            ...chapter,
            progress: calculateChapterProgress(chapter.lessons, completedLessonIds),
          })),
        }));
        
        setCourses(coursesWithProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [completedLessonIds]);

  return { courses, loading, error, refetch: () => {
    setLoading(true);
    apiService.getCourses().then(response => {
      // Calculate dynamic progress for each course and chapter
      const coursesWithProgress = response.data.map(course => ({
        ...course,
        progress: calculateCourseProgress(course, completedLessonIds),
        chapters: course.chapters.map(chapter => ({
          ...chapter,
          progress: calculateChapterProgress(chapter.lessons, completedLessonIds),
        })),
      }));
      
      setCourses(coursesWithProgress);
      setLoading(false);
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      setLoading(false);
    });
  }};
};








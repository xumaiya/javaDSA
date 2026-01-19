import { useState, useEffect } from 'react';
import { Course } from '../types';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';

/**
 * Calculate course progress based on completed lessons.
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
 */
const calculateChapterProgress = (lessons: any[], completedLessonIds: number[]): number => {
  if (lessons.length === 0) return 0;
  
  const completedCount = lessons.filter(lesson => {
    const numericId = parseInt(lesson.id.split('-').pop() || '0', 10);
    return completedLessonIds.includes(numericId);
  }).length;
  
  return Math.round((completedCount / lessons.length) * 100);
};

export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { completedLessonIds } = useAuthStore();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getCourseById(courseId);
        
        // Calculate dynamic progress for course and chapters
        const courseWithProgress = {
          ...response.data,
          progress: calculateCourseProgress(response.data, completedLessonIds),
          chapters: response.data.chapters.map(chapter => ({
            ...chapter,
            progress: calculateChapterProgress(chapter.lessons, completedLessonIds),
          })),
        };
        
        setCourse(courseWithProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, completedLessonIds]);

  return { course, loading, error };
};








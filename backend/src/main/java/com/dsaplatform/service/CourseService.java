package com.dsaplatform.service;

import com.dsaplatform.dto.response.ChapterDto;
import com.dsaplatform.dto.response.CourseDto;
import com.dsaplatform.dto.response.LessonDto;
import com.dsaplatform.mapper.ChapterMapper;
import com.dsaplatform.mapper.CourseMapper;
import com.dsaplatform.mapper.LessonMapper;
import com.dsaplatform.model.entity.*;
import com.dsaplatform.model.entity.Course.Difficulty;
import com.dsaplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseMapper courseMapper;
    private final ChapterMapper chapterMapper;
    private final LessonMapper lessonMapper;
    
    public Page<CourseDto> getAllCourses(Pageable pageable, Difficulty difficulty, String search) {
        Page<Course> courses;
        if (search != null && !search.isEmpty()) {
            courses = courseRepository.searchCourses(search, pageable);
        } else if (difficulty != null) {
            courses = courseRepository.findByDifficulty(difficulty, pageable);
        } else {
            courses = courseRepository.findAll(pageable);
        }
        
        return courses.map(course -> {
            CourseDto dto = courseMapper.toDto(course);
            dto.setChapters(null); // Don't include chapters in list view
            return dto;
        });
    }
    
    public CourseDto getCourseById(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        CourseDto dto = courseMapper.toDto(course);
        
        // Calculate progress if user is provided
        if (userId != null) {
            int totalLessons = course.getChapters().stream()
                    .mapToInt(ch -> ch.getLessons().size())
                    .sum();
            long completedLessons = lessonProgressRepository.countCompletedLessonsByUserId(userId);
            dto.setProgress(totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0);
        }
        
        // Map chapters with progress
        List<ChapterDto> chapterDtos = course.getChapters().stream()
                .map(chapter -> {
                    ChapterDto chapterDto = chapterMapper.toDto(chapter);
                    if (userId != null) {
                        calculateChapterProgress(chapterDto, chapter, userId);
                    }
                    return chapterDto;
                })
                .collect(Collectors.toList());
        
        dto.setChapters(chapterDtos);
        return dto;
    }
    
    public ChapterDto getChapterById(Long chapterId, Long userId) {
        Chapter chapter = chapterRepository.findByIdWithLessons(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
        
        ChapterDto dto = chapterMapper.toDto(chapter);
        if (userId != null) {
            calculateChapterProgress(dto, chapter, userId);
        }
        return dto;
    }
    
    public LessonDto getLessonById(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findByIdWithChapterAndCourse(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        
        LessonDto dto = lessonMapper.toDto(lesson);
        if (userId != null) {
            lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId)
                    .ifPresent(progress -> dto.setCompleted(progress.getCompleted()));
        }
        return dto;
    }
    
    private void calculateChapterProgress(ChapterDto dto, Chapter chapter, Long userId) {
        int totalLessons = chapter.getLessons().size();
        long completedLessons = chapter.getLessons().stream()
                .mapToLong(lesson -> lessonProgressRepository
                        .findByUserIdAndLessonId(userId, lesson.getId())
                        .map(LessonProgress::getCompleted)
                        .orElse(false) ? 1 : 0)
                .sum();
        dto.setProgress(totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0);
        dto.setUnlocked(true); // TODO: Implement unlock logic based on prerequisites
    }
}








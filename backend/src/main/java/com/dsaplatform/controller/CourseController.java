package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.ChapterDto;
import com.dsaplatform.dto.response.CourseDto;
import com.dsaplatform.dto.response.LessonDto;
import com.dsaplatform.model.entity.Course.Difficulty;
import com.dsaplatform.service.CourseService;
import com.dsaplatform.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    private final SecurityUtil securityUtil;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourseDto>>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String search,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Long userId = securityUtil.getUserId(authentication);
        Page<CourseDto> courses = courseService.getAllCourses(pageable, difficulty, search);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }
    
    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(
            @PathVariable Long courseId,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        CourseDto course = courseService.getCourseById(courseId, userId);
        return ResponseEntity.ok(ApiResponse.success(course));
    }
    
    @GetMapping("/{courseId}/chapters/{chapterId}")
    public ResponseEntity<ApiResponse<ChapterDto>> getChapterById(
            @PathVariable Long courseId,
            @PathVariable Long chapterId,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        ChapterDto chapter = courseService.getChapterById(chapterId, userId);
        return ResponseEntity.ok(ApiResponse.success(chapter));
    }
    
    @GetMapping("/{courseId}/chapters/{chapterId}/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<LessonDto>> getLessonById(
            @PathVariable Long courseId,
            @PathVariable Long chapterId,
            @PathVariable Long lessonId,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        LessonDto lesson = courseService.getLessonById(lessonId, userId);
        return ResponseEntity.ok(ApiResponse.success(lesson));
    }
}


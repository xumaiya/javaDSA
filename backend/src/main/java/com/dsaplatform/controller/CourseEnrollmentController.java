package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.model.entity.CourseEnrollment;
import com.dsaplatform.service.CourseEnrollmentService;
import com.dsaplatform.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseEnrollmentController {
    
    private final CourseEnrollmentService enrollmentService;
    private final SecurityUtil securityUtil;
    
    /**
     * Enroll in a course.
     */
    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<ApiResponse<Void>> enrollInCourse(
            @PathVariable String courseId,
            @RequestParam(required = false) String courseTitle,
            Authentication authentication) {
        
        Long userId = securityUtil.getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }
        
        enrollmentService.enrollInCourse(userId, courseId, courseTitle);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully enrolled in course"));
    }
    
    /**
     * Get all enrolled course IDs for the current user.
     */
    @GetMapping("/enrolled")
    public ResponseEntity<ApiResponse<List<String>>> getEnrolledCourses(Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }
        
        List<String> courseIds = enrollmentService.getUserEnrollments(userId).stream()
                .map(CourseEnrollment::getCourseId)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(courseIds));
    }
    
    /**
     * Check if user is enrolled in a specific course.
     */
    @GetMapping("/{courseId}/enrolled")
    public ResponseEntity<ApiResponse<Boolean>> isEnrolled(
            @PathVariable String courseId,
            Authentication authentication) {
        
        Long userId = securityUtil.getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized"));
        }
        
        boolean enrolled = enrollmentService.isEnrolled(userId, courseId);
        
        return ResponseEntity.ok(ApiResponse.success(enrolled));
    }
}

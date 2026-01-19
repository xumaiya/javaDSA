package com.dsaplatform.service;

import com.dsaplatform.model.entity.CourseEnrollment;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.repository.CourseEnrollmentRepository;
import com.dsaplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseEnrollmentService {
    
    private final CourseEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    
    /**
     * Enroll a user in a course.
     */
    @Transactional
    public CourseEnrollment enrollInCourse(Long userId, String courseId, String courseTitle) {
        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            log.info("User {} already enrolled in course {}", userId, courseId);
            return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CourseEnrollment enrollment = CourseEnrollment.builder()
                .user(user)
                .courseId(courseId)
                .courseTitle(courseTitle)
                .build();
        
        enrollment = enrollmentRepository.save(enrollment);
        log.info("User {} enrolled in course {}", userId, courseId);
        
        return enrollment;
    }
    
    /**
     * Get all courses a user is enrolled in.
     */
    @Transactional(readOnly = true)
    public List<CourseEnrollment> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }
    
    /**
     * Check if user is enrolled in a course.
     */
    @Transactional(readOnly = true)
    public boolean isEnrolled(Long userId, String courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
    
    /**
     * Get count of enrolled courses for a user.
     */
    @Transactional(readOnly = true)
    public long getEnrolledCoursesCount(Long userId) {
        return enrollmentRepository.countByUserId(userId);
    }
}

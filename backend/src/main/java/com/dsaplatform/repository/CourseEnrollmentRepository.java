package com.dsaplatform.repository;

import com.dsaplatform.model.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    
    List<CourseEnrollment> findByUserId(Long userId);
    
    Optional<CourseEnrollment> findByUserIdAndCourseId(Long userId, String courseId);
    
    boolean existsByUserIdAndCourseId(Long userId, String courseId);
    
    long countByUserId(Long userId);
}

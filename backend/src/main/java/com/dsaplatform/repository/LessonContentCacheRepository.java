package com.dsaplatform.repository;

import com.dsaplatform.model.entity.LessonContentCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LessonContentCacheRepository extends JpaRepository<LessonContentCache, Long> {
    
    Optional<LessonContentCache> findByLessonId(String lessonId);
    
    boolean existsByLessonId(String lessonId);
    
    void deleteByLessonId(String lessonId);
}

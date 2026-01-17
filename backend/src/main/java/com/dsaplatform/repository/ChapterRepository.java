package com.dsaplatform.repository;

import com.dsaplatform.model.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByCourseIdOrderByOrderAsc(Long courseId);
    
    @Query("SELECT c FROM Chapter c JOIN FETCH c.lessons WHERE c.id = :id")
    Optional<Chapter> findByIdWithLessons(@Param("id") Long id);
}








package com.dsaplatform.repository;

import com.dsaplatform.model.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByChapterIdOrderByOrderAsc(Long chapterId);
    
    @Query("SELECT l FROM Lesson l JOIN FETCH l.chapter c JOIN FETCH c.course WHERE l.id = :id")
    Optional<Lesson> findByIdWithChapterAndCourse(@Param("id") Long id);
}








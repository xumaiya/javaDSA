package com.dsaplatform.repository;

import com.dsaplatform.model.entity.LessonEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonEmbeddingRepository extends JpaRepository<LessonEmbedding, Long> {
    
    List<LessonEmbedding> findByLessonIdOrderByChunkIndexAsc(Long lessonId);
    
    /**
     * Find all embeddings for similarity search.
     * The actual similarity calculation will be done in-memory.
     */
    @Query("SELECT le FROM LessonEmbedding le WHERE le.embedding IS NOT NULL")
    List<LessonEmbedding> findAllWithEmbeddings();
    
    /**
     * Find embeddings by lesson ID.
     */
    @Query("SELECT le FROM LessonEmbedding le WHERE le.lesson.id = :lessonId AND le.embedding IS NOT NULL")
    List<LessonEmbedding> findByLessonIdWithEmbeddings(@Param("lessonId") Long lessonId);
    
    /**
     * Delete all embeddings for a lesson.
     */
    void deleteByLessonId(Long lessonId);
    
    /**
     * Count embeddings for a lesson.
     */
    long countByLessonId(Long lessonId);
}

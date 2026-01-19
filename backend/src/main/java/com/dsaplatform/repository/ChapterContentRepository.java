package com.dsaplatform.repository;

import com.dsaplatform.model.entity.ChapterContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for ChapterContent entity.
 * Handles persistence of dynamically generated chapter content.
 */
@Repository
public interface ChapterContentRepository extends JpaRepository<ChapterContent, Long> {
    
    /**
     * Find chapter content by chapter name (case-insensitive).
     * 
     * @param chapterName The name of the chapter
     * @return Optional containing the chapter content if found
     */
    @Query("SELECT cc FROM ChapterContent cc LEFT JOIN FETCH cc.lessons WHERE LOWER(cc.chapterName) = LOWER(:chapterName)")
    Optional<ChapterContent> findByChapterNameIgnoreCase(@Param("chapterName") String chapterName);
    
    /**
     * Check if content exists for a given chapter name.
     * 
     * @param chapterName The name of the chapter
     * @return true if content exists, false otherwise
     */
    boolean existsByChapterNameIgnoreCase(String chapterName);
    
    /**
     * Delete chapter content by chapter name.
     * 
     * @param chapterName The name of the chapter
     */
    void deleteByChapterNameIgnoreCase(String chapterName);
}

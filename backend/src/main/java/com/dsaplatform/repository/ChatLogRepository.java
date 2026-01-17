package com.dsaplatform.repository;

import com.dsaplatform.model.entity.ChatLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    
    /**
     * Find all chat logs for a specific user, ordered by question timestamp descending.
     * Supports pagination for efficient retrieval of chat history.
     * 
     * @param userId the ID of the user whose chat logs to retrieve
     * @param pageable pagination information
     * @return a page of chat logs for the specified user
     */
    Page<ChatLog> findByUserIdOrderByQuestionTimestampDesc(Long userId, Pageable pageable);
}

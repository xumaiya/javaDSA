package com.dsaplatform.repository;

import com.dsaplatform.model.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUserId(Long userId);
    
    @Query("SELECT ub FROM UserBadge ub WHERE ub.user.id = :userId AND ub.badge.id = :badgeId")
    UserBadge findByUserIdAndBadgeId(@Param("userId") Long userId, @Param("badgeId") Long badgeId);
    
    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);
}








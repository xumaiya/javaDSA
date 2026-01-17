package com.dsaplatform.service;

import com.dsaplatform.dto.response.BadgeDto;
import com.dsaplatform.mapper.BadgeMapper;
import com.dsaplatform.model.entity.Badge;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.model.entity.UserBadge;
import com.dsaplatform.repository.BadgeRepository;
import com.dsaplatform.repository.UserBadgeRepository;
import com.dsaplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadgeService {
    
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;
    private final BadgeMapper badgeMapper;
    
    public List<BadgeDto> getAllBadges() {
        return badgeRepository.findAll().stream()
                .map(badgeMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public List<BadgeDto> getUserBadges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getBadges().stream()
                .map(UserBadge::getBadge)
                .map(badge -> {
                    BadgeDto dto = badgeMapper.toDto(badge);
                    dto.setEarnedAt(user.getBadges().stream()
                            .filter(ub -> ub.getBadge().getId().equals(badge.getId()))
                            .findFirst()
                            .map(UserBadge::getEarnedAt)
                            .orElse(null));
                    return dto;
                })
                .collect(Collectors.toList());
    }
}








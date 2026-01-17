package com.dsaplatform.service;

import com.dsaplatform.dto.response.BadgeDto;
import com.dsaplatform.dto.response.UserDto;
import com.dsaplatform.mapper.BadgeMapper;
import com.dsaplatform.mapper.UserMapper;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.model.entity.UserBadge;
import com.dsaplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BadgeMapper badgeMapper;
    
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserDtoWithBadges(user);
    }
    
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserDtoWithBadges(user);
    }
    
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDto.getUsername() != null) {
            user.setUsername(userDto.getUsername());
        }
        if (userDto.getAvatar() != null) {
            user.setAvatar(userDto.getAvatar());
        }
        
        user = userRepository.save(user);
        return toUserDtoWithBadges(user);
    }
    
    private UserDto toUserDtoWithBadges(User user) {
        UserDto dto = userMapper.toDto(user);
        List<BadgeDto> badges = user.getBadges().stream()
                .map(UserBadge::getBadge)
                .map(badge -> {
                    BadgeDto badgeDto = badgeMapper.toDto(badge);
                    badgeDto.setEarnedAt(user.getBadges().stream()
                            .filter(ub -> ub.getBadge().getId().equals(badge.getId()))
                            .findFirst()
                            .map(UserBadge::getEarnedAt)
                            .orElse(null));
                    return badgeDto;
                })
                .collect(Collectors.toList());
        dto.setBadges(badges);
        return dto;
    }
}








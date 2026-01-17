package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String avatar;
    private Integer points;
    private Integer streak;
    private Integer level;
    private String role;
    private LocalDateTime createdAt;
    private List<BadgeDto> badges;
}








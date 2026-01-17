package com.dsaplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private Integer rank;
    private Long userId;
    private String username;
    private String avatar;
    private Integer points;
    private Integer streak;
    private Integer level;
}








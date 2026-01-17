package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.LeaderboardEntryDto;
import com.dsaplatform.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    
    private final LeaderboardService leaderboardService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDto>>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<LeaderboardEntryDto> entries = leaderboardService.getLeaderboard(limit);
        return ResponseEntity.ok(ApiResponse.success(entries));
    }
}








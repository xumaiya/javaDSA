package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.BadgeDto;
import com.dsaplatform.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {
    
    private final BadgeService badgeService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BadgeDto>>> getAllBadges() {
        List<BadgeDto> badges = badgeService.getAllBadges();
        return ResponseEntity.ok(ApiResponse.success(badges));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<BadgeDto>>> getUserBadges(@PathVariable Long userId) {
        List<BadgeDto> badges = badgeService.getUserBadges(userId);
        return ResponseEntity.ok(ApiResponse.success(badges));
    }
}








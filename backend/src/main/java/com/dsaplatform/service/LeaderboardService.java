package com.dsaplatform.service;

import com.dsaplatform.dto.response.LeaderboardEntryDto;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    
    private final UserRepository userRepository;
    
    public List<LeaderboardEntryDto> getLeaderboard(int limit) {
        // Try to get from in-memory cache first
        Map<Long, Integer> cache = GamificationService.getLeaderboardCache();
        
        if (!cache.isEmpty()) {
            return getLeaderboardFromCache(cache, limit);
        }
        
        // Fallback to database
        return getLeaderboardFromDatabase(limit);
    }
    
    private List<LeaderboardEntryDto> getLeaderboardFromCache(Map<Long, Integer> cache, int limit) {
        List<LeaderboardEntryDto> entries = new ArrayList<>();
        
        // Sort by points descending
        List<Map.Entry<Long, Integer>> sortedEntries = cache.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(limit)
                .toList();
        
        int rank = 1;
        for (Map.Entry<Long, Integer> entry : sortedEntries) {
            Long userId = entry.getKey();
            Integer points = entry.getValue();
            
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                LeaderboardEntryDto dto = LeaderboardEntryDto.builder()
                        .rank(rank++)
                        .userId(user.getId())
                        .username(user.getUsername())
                        .avatar(user.getAvatar())
                        .points(points)
                        .streak(user.getStreak())
                        .level(user.getLevel())
                        .build();
                entries.add(dto);
            }
        }
        
        // If cache doesn't have enough entries, supplement from database
        if (entries.size() < limit) {
            return getLeaderboardFromDatabase(limit);
        }
        
        return entries;
    }
    
    private List<LeaderboardEntryDto> getLeaderboardFromDatabase(int limit) {
        List<User> topUsers = userRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getPoints(), a.getPoints()))
                .limit(limit)
                .toList();
        
        List<LeaderboardEntryDto> entries = new ArrayList<>();
        int rank = 1;
        
        for (User user : topUsers) {
            LeaderboardEntryDto entry = LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .avatar(user.getAvatar())
                    .points(user.getPoints())
                    .streak(user.getStreak())
                    .level(user.getLevel())
                    .build();
            entries.add(entry);
        }
        
        return entries;
    }
}

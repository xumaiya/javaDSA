package com.dsaplatform.controller;

import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.UserDto;
import com.dsaplatform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto userDto,
            Authentication authentication) {
        // Ensure user can only update their own profile
        String email = authentication.getName();
        UserDto currentUser = userService.getUserByEmail(email);
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Unauthorized"));
        }
        
        UserDto updated = userService.updateUser(id, userDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "User updated successfully"));
    }
}








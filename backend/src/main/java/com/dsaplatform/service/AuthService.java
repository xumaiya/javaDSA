package com.dsaplatform.service;

import com.dsaplatform.dto.request.LoginRequest;
import com.dsaplatform.dto.request.RegisterRequest;
import com.dsaplatform.dto.response.AuthResponse;
import com.dsaplatform.dto.response.UserDto;
import com.dsaplatform.mapper.UserMapper;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.repository.UserRepository;
import com.dsaplatform.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.STUDENT)
                .points(0)
                .streak(0)
                .level(1)
                .build();
        
        user = userRepository.save(user);
        
        String accessToken = jwtService.generateToken(user.getEmail(), new java.util.HashMap<>());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        
        UserDto userDto = userMapper.toDto(user);
        
        return AuthResponse.builder()
                .user(userDto)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String accessToken = jwtService.generateToken(user.getEmail(), new java.util.HashMap<>());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        
        UserDto userDto = userMapper.toDto(user);
        
        return AuthResponse.builder()
                .user(userDto)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}








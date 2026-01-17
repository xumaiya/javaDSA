package com.dsaplatform.controller;

import com.dsaplatform.dto.request.ChatMessageRequest;
import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.ChatMessageResponse;
import com.dsaplatform.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {
    
    private final ChatbotService chatbotService;
    
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatbotService.processMessage(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}








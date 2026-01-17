package com.dsaplatform.controller;

import com.dsaplatform.dto.request.CodeExecutionRequest;
import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.CodeExecutionResponse;
import com.dsaplatform.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code")
@RequiredArgsConstructor
public class CodeExecutionController {
    
    private final CodeExecutionService codeExecutionService;
    
    @PostMapping("/execute")
    public ResponseEntity<ApiResponse<CodeExecutionResponse>> executeCode(
            @RequestBody CodeExecutionRequest request) {
        try {
            CodeExecutionResponse response = codeExecutionService.executeJavaCode(request.getCode());
            return ResponseEntity.ok(ApiResponse.success(response, "Code executed successfully"));
        } catch (Exception e) {
            CodeExecutionResponse errorResponse = CodeExecutionResponse.builder()
                    .output("")
                    .error(e.getMessage())
                    .executionTime(0L)
                    .build();
            return ResponseEntity.ok(ApiResponse.success(errorResponse, "Execution completed with errors"));
        }
    }
}

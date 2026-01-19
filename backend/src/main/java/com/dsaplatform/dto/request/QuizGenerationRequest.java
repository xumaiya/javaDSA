package com.dsaplatform.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for quiz generation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizGenerationRequest {
    
    @NotBlank(message = "Topic is required")
    private String topic;
    
    @NotBlank(message = "Difficulty is required")
    @Pattern(regexp = "beginner|intermediate|advanced", 
             message = "Difficulty must be beginner, intermediate, or advanced")
    private String difficulty;
    
    @Min(value = 3, message = "Question count must be at least 3")
    @Max(value = 10, message = "Question count must be at most 10")
    private int questionCount = 5;
}

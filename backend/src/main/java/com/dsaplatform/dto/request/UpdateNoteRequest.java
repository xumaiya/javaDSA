package com.dsaplatform.dto.request;

import lombok.Data;

@Data
public class UpdateNoteRequest {
    private String title;
    private String content;
    private Long lessonId;
}








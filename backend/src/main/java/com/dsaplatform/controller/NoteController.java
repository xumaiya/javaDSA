package com.dsaplatform.controller;

import com.dsaplatform.dto.request.CreateNoteRequest;
import com.dsaplatform.dto.request.UpdateNoteRequest;
import com.dsaplatform.dto.response.ApiResponse;
import com.dsaplatform.dto.response.NoteDto;
import com.dsaplatform.service.NoteService;
import com.dsaplatform.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    
    private final NoteService noteService;
    private final SecurityUtil securityUtil;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NoteDto>>> getUserNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long lessonId,
            @RequestParam(required = false) String search,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<NoteDto> notes = noteService.getUserNotes(userId, pageable, lessonId, search);
        return ResponseEntity.ok(ApiResponse.success(notes));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteDto>> getNoteById(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        NoteDto note = noteService.getNoteById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(note));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<NoteDto>> createNote(
            @Valid @RequestBody CreateNoteRequest request,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        NoteDto note = noteService.createNote(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(note, "Note created successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteDto>> updateNote(
            @PathVariable Long id,
            @RequestBody UpdateNoteRequest request,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        NoteDto note = noteService.updateNote(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success(note, "Note updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = securityUtil.getUserId(authentication);
        noteService.deleteNote(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Note deleted successfully"));
    }
}


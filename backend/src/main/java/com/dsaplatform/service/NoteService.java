package com.dsaplatform.service;

import com.dsaplatform.dto.request.CreateNoteRequest;
import com.dsaplatform.dto.request.UpdateNoteRequest;
import com.dsaplatform.dto.response.NoteDto;
import com.dsaplatform.mapper.NoteMapper;
import com.dsaplatform.model.entity.Lesson;
import com.dsaplatform.model.entity.Note;
import com.dsaplatform.model.entity.User;
import com.dsaplatform.repository.LessonRepository;
import com.dsaplatform.repository.NoteRepository;
import com.dsaplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {
    
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final NoteMapper noteMapper;
    
    public Page<NoteDto> getUserNotes(Long userId, Pageable pageable, Long lessonId, String search) {
        if (lessonId != null) {
            List<Note> notes = noteRepository.findByUserIdAndLessonId(userId, lessonId);
            Specification<Note> spec = (root, query, cb) -> root.get("id").in(notes.stream().map(Note::getId).toList());
            return noteRepository.findAll(spec, pageable)
                    .map(noteMapper::toDto);
        } else if (search != null && !search.isEmpty()) {
            return noteRepository.searchByUserAndQuery(userId, search, pageable)
                    .map(noteMapper::toDto);
        } else {
            return noteRepository.findByUserId(userId, pageable)
                    .map(noteMapper::toDto);
        }
    }
    
    public NoteDto getNoteById(Long noteId, Long userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to note");
        }
        
        return noteMapper.toDto(note);
    }
    
    @Transactional
    public NoteDto createNote(Long userId, CreateNoteRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Note note = Note.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        
        if (request.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            note.setLesson(lesson);
        }
        
        note = noteRepository.save(note);
        return noteMapper.toDto(note);
    }
    
    @Transactional
    public NoteDto updateNote(Long noteId, Long userId, UpdateNoteRequest request) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to note");
        }
        
        if (request.getTitle() != null) {
            note.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            note.setContent(request.getContent());
        }
        if (request.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            note.setLesson(lesson);
        }
        
        note = noteRepository.save(note);
        return noteMapper.toDto(note);
    }
    
    @Transactional
    public void deleteNote(Long noteId, Long userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to note");
        }
        
        noteRepository.delete(note);
    }
}








package com.dsaplatform.mapper;

import com.dsaplatform.dto.response.NoteDto;
import com.dsaplatform.model.entity.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    NoteMapper INSTANCE = Mappers.getMapper(NoteMapper.class);
    
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "lessonId", expression = "java(note.getLesson() != null ? note.getLesson().getId() : null)")
    NoteDto toDto(Note note);
    
    List<NoteDto> toDtoList(List<Note> notes);
}








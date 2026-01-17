package com.dsaplatform.mapper;

import com.dsaplatform.dto.response.LessonDto;
import com.dsaplatform.model.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    LessonMapper INSTANCE = Mappers.getMapper(LessonMapper.class);
    
    @Mapping(target = "chapterId", source = "chapter.id")
    @Mapping(target = "completed", ignore = true) // Calculated separately
    @Mapping(target = "unlocked", ignore = true) // Calculated separately
    LessonDto toDto(Lesson lesson);
    
    List<LessonDto> toDtoList(List<Lesson> lessons);
}








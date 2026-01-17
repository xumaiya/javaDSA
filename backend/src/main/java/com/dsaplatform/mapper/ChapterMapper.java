package com.dsaplatform.mapper;

import com.dsaplatform.dto.response.ChapterDto;
import com.dsaplatform.model.entity.Chapter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {LessonMapper.class})
public interface ChapterMapper {
    ChapterMapper INSTANCE = Mappers.getMapper(ChapterMapper.class);
    
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "progress", ignore = true) // Calculated separately
    @Mapping(target = "unlocked", ignore = true) // Calculated separately
    ChapterDto toDto(Chapter chapter);
    
    List<ChapterDto> toDtoList(List<Chapter> chapters);
}








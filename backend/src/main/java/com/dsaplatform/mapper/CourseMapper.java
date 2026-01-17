package com.dsaplatform.mapper;

import com.dsaplatform.dto.response.CourseDto;
import com.dsaplatform.model.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ChapterMapper.class})
public interface CourseMapper {
    CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);
    
    @Mapping(target = "difficulty", expression = "java(course.getDifficulty().name())")
    @Mapping(target = "progress", ignore = true) // Calculated separately
    @Mapping(target = "enrolledAt", ignore = true) // Calculated separately
    CourseDto toDto(Course course);
    
    List<CourseDto> toDtoList(List<Course> courses);
}








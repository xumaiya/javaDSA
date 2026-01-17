package com.dsaplatform.mapper;

import com.dsaplatform.dto.response.BadgeDto;
import com.dsaplatform.model.entity.Badge;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BadgeMapper {
    BadgeMapper INSTANCE = Mappers.getMapper(BadgeMapper.class);
    
    @Mapping(target = "rarity", expression = "java(badge.getRarity().name())")
    @Mapping(target = "earnedAt", ignore = true) // Set separately
    BadgeDto toDto(Badge badge);
    
    List<BadgeDto> toDtoList(List<Badge> badges);
}








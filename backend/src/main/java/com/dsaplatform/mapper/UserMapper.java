package com.dsaplatform.mapper;

import com.dsaplatform.dto.response.UserDto;
import com.dsaplatform.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserDto toDto(User user);
    
    List<UserDto> toDtoList(List<User> users);
}








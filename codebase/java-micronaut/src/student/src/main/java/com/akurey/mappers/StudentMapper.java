package com.akurey.mappers;

import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.persistence.entities.Student;

import org.mapstruct.Mapper;

import jakarta.inject.Singleton;

@Singleton
@Mapper(componentModel = "jakarta")
public interface StudentMapper extends
        RequestToEntityMapper<StudentRequest, Student>,
        EntityToResponseMapper<Student, StudentResponse> {
}

package com.akurey.services;

import java.util.List;
import java.util.stream.StreamSupport;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.AKNotFoundException;
import com.akurey.common.models.MessageResponse;
import com.akurey.mappers.StudentMapper;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;
import com.akurey.persistence.entities.Student;
import com.akurey.persistence.repositories.StudentRepository;

import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

  private final StudentRepository studentRepository;
  private final StudentMapper studentMapper;

  @Override
  public StudentsResponse getStudents() throws AKException {
    final List<Student> result =  StreamSupport.stream(
            studentRepository.findAll().spliterator(), false).toList();
    final List<StudentResponse> students = studentMapper.toResponses(result);

    return StudentsResponse.builder()
        .students(students)
        .build();
  }

  @Override
  public StudentResponse getStudent(final Long studentId) throws AKException {
    final Student student = studentRepository.findById(studentId).orElseThrow(AKNotFoundException::new);
    return studentMapper.toResponse(student);
  }

  @Override
  public StudentResponse createStudent(final StudentRequest student) {
    final Student newStudent = studentMapper.toEntity(student);
    return studentMapper.toResponse(studentRepository.save(newStudent));
  }

  @Override
  public StudentResponse updateStudent(final StudentRequest student) throws AKException {
    final Student studentToUpdate = studentMapper.toEntity(student);
    studentRepository.findById(studentToUpdate.getId())
        .orElseThrow(AKNotFoundException::new);

    return studentMapper.toResponse(studentRepository.update(studentToUpdate));
  }

  @Override
  public MessageResponse deleteStudent(final Long studentId) throws AKException {
    final Student student = studentRepository.findById(studentId).orElseThrow(AKNotFoundException::new);
    studentRepository.delete(student);
    return new MessageResponse();
  }
}

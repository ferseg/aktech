package com.akurey.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.AKNotFoundException;
import com.akurey.common.models.MessageResponse;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;
import com.akurey.repositories.StudentRepository;
import com.akurey.repositories.entities.Student;
import com.akurey.repositories.entities.TestParams;
import com.akurey.repositories.entities.TestResult;
import com.google.common.collect.ImmutableList;

import io.micronaut.core.util.StringUtils;
import jakarta.inject.Inject;

public class StudentServiceImpl implements StudentService {

  private final StudentRepository studentRepository;

  @Inject
  public StudentServiceImpl(StudentRepository studentRepository) {
    this.studentRepository = studentRepository;
  }

  @Override
  public StudentsResponse getStudents() {
    try {
      TestResult result = studentRepository.test(new TestParams());
      System.out.println("id: " + result.getId());
    }
    catch (Exception e) {
      System.out.println("ERROR");
    }

    final List<Student> result = ImmutableList.copyOf(studentRepository.findAll());
    final List<StudentResponse> students = result.stream()
        .map(this::mapStudentToStudentResponse)
        .collect(ImmutableList.toImmutableList());

    return StudentsResponse.builder()
        .students(students)
        .build();
  }

  @Override
  public StudentResponse getStudent(final Long studentId) throws AKException {
    final Student student = studentRepository.findById(studentId).orElseThrow(AKNotFoundException::new);
    return mapStudentToStudentResponse(student);
  }

  @Override
  public StudentResponse createStudent(final StudentRequest student) {
    final Student newStudent = Student.builder()
        .firstName(student.getFirstName())
        .middleName(student.getMiddleName())
        .lastName(student.getLastName())
        .email(student.getEmail())
        .created(LocalDateTime.now())
        .updated(LocalDateTime.now())
        .build();

    return mapStudentToStudentResponse(studentRepository.save(newStudent));
  }

  @Override
  public StudentResponse updateStudent(final StudentRequest student) throws AKException {
    final Student existingStudent = studentRepository.findById(student.getStudentId())
        .orElseThrow(AKNotFoundException::new);

    existingStudent.setFirstName(student.getFirstName());
    existingStudent.setMiddleName(Optional.ofNullable(student.getMiddleName()).orElse(StringUtils.EMPTY_STRING));
    existingStudent.setLastName(student.getLastName());
    existingStudent.setEmail(student.getEmail());
    existingStudent.setUpdated(LocalDateTime.now());

    return mapStudentToStudentResponse(studentRepository.update(existingStudent));
  }

  @Override
  public MessageResponse deleteStudent(final Long studentId) throws AKException {
    final Student student = studentRepository.findById(studentId).orElseThrow(AKNotFoundException::new);
    studentRepository.delete(student);
    return new MessageResponse();
  }

  private StudentResponse mapStudentToStudentResponse(final Student student) {
    return StudentResponse.builder()
        .studentId(student.getStudentId())
        .firstName(student.getFirstName())
        .middleName(student.getMiddleName())
        .lastName(student.getLastName())
        .email(student.getEmail())
        .created(student.getCreated())
        .updated(student.getUpdated())
        .build();
  }
}

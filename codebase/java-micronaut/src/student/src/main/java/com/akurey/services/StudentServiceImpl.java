package com.akurey.services;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.repositories.StudentRepository;
import com.akurey.repositories.entities.Student;
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
    public List<StudentResponse> getStudents() {
        final List<Student> students = ImmutableList.copyOf(studentRepository.findAll());
        return students.stream()
                .map(this::mapStudentToStudentResponse)
                .collect(ImmutableList.toImmutableList());
    }

    @Override
    public StudentResponse getStudent(final Long studentId) {
        return mapStudentToStudentResponse(studentRepository.findById(studentId).orElseThrow());
    }

    @Override
    public StudentResponse createStudent(final StudentRequest student) {
        final Student newStudent = new Student();
        newStudent.setFirstName(student.getFirstName());
        newStudent.setMiddleName(Optional.ofNullable(student.getMiddleName()).orElse(StringUtils.EMPTY_STRING));
        newStudent.setLastName(student.getLastName());
        newStudent.setEmail(student.getEmail());
        newStudent.setCreated(LocalDateTime.now());
        newStudent.setUpdated(LocalDateTime.now());

        return mapStudentToStudentResponse(studentRepository.save(newStudent));
    }

    @Override
    public StudentResponse updateStudent(final Long stundentId, final StudentRequest student) {
        final Student existingStudent = studentRepository.findById(stundentId).orElseThrow();
        existingStudent.setFirstName(student.getFirstName());
        existingStudent.setMiddleName(Optional.ofNullable(student.getMiddleName()).orElse(StringUtils.EMPTY_STRING));
        existingStudent.setLastName(student.getLastName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setUpdated(LocalDateTime.now());
        
        return mapStudentToStudentResponse(studentRepository.update(existingStudent));
    }

    @Override
    public boolean deleteStudent(final Long studentId) {
        final Student student = studentRepository.findById(studentId).orElseThrow();
        studentRepository.delete(student);
        return Boolean.TRUE;
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

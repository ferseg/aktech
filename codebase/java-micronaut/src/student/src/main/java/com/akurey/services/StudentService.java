package com.akurey.services;

import java.util.List;

import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;

public interface StudentService {
    List<StudentResponse> getStudents();
    StudentResponse getStudent(Long studentId);
    StudentResponse createStudent(StudentRequest student);
    StudentResponse updateStudent(Long stundentId, StudentRequest student);
    boolean deleteStudent(Long studentId);
}

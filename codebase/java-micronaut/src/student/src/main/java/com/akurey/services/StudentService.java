package com.akurey.services;

import com.akurey.common.exceptions.CustomException;
import com.akurey.common.models.MessageResponse;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;

public interface StudentService {

  StudentsResponse getStudents();

  StudentResponse getStudent(Long studentId) throws CustomException;

  StudentResponse createStudent(StudentRequest student);

  StudentResponse updateStudent(Long studentId, StudentRequest student) throws CustomException;

  MessageResponse deleteStudent(Long studentId) throws CustomException;
}

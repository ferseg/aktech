package com.akurey.services;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.models.MessageResponse;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;

public interface StudentService {

  StudentsResponse getStudents();

  StudentResponse getStudent(Long studentId) throws AKException;

  StudentResponse createStudent(StudentRequest student);

  StudentResponse updateStudent(StudentRequest student) throws AKException;

  MessageResponse deleteStudent(Long studentId) throws AKException;
}

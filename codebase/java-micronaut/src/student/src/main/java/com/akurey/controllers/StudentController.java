package com.akurey.controllers;

import com.akurey.common.http.BaseController;
import com.akurey.common.models.EmptyRequest;
import com.akurey.common.models.MessageResponse;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;
import com.akurey.services.StudentService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.security.annotation.Secured;
import jakarta.inject.Inject;

@Controller("/v1/students")
public class StudentController extends BaseController {

  @Inject
  StudentService studentService;

  @Secured({ "ROLE_USER", "ROLE_ADMIN" })
  @Get(value = "/", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudents() {
    try {
      StudentsResponse response = studentService.getStudents();
      return buildOkResponse(new EmptyRequest(), response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_USER", "ROLE_ADMIN" })
  @Get(value = "/{studentId}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudent(final Long studentId) {
    try {
      StudentResponse response = studentService.getStudent(studentId);
      return buildOkResponse(new EmptyRequest(), response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.NOT_FOUND).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_ADMIN" })
  @Post(value = "/", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> createStudent(@Body StudentRequest request) {
    try {
      StudentResponse response = studentService.createStudent(request);
      return buildCreatedResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_ADMIN" })
  @Put(value = "/{studentId}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> updateStudent(@Body StudentRequest request, final Long studentId) {
    try {
      StudentResponse response = studentService.updateStudent(studentId, request);
      return buildOkResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_ADMIN", "ROLE_USER" })
  @Delete(value = "/{studentId}", processes = MediaType.APPLICATION_JSON)
  public HttpResponse<?> deleteStudent(final Long studentId) {
    try {
      MessageResponse response = studentService.deleteStudent(studentId);
      return buildOkResponse(new EmptyRequest(), response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }
}

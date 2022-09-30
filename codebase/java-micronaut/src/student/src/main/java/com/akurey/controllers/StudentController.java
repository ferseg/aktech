package com.akurey.controllers;

import javax.validation.Valid;

import com.akurey.common.http.BaseController;
import com.akurey.common.models.EmptyRequest;
import com.akurey.common.models.EntityIdRequest;
import com.akurey.common.models.MessageResponse;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;
import com.akurey.services.StudentService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.RequestBean;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import jakarta.inject.Inject;

@Controller("/v1/students")
public class StudentController extends BaseController {

  @Inject
  private StudentService studentService;

  @Secured({ "ROLE_USER", "ROLE_ADMIN" })
  @Get(value = "/", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudents(@RequestBean @Valid EmptyRequest request, Authentication authentication) {
    try {
      setupRequest(request, authentication);
      StudentsResponse response = studentService.getStudents();
      return buildOkResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_USER", "ROLE_ADMIN" })
  @Get(value = "/{id}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudent(final Long id, Authentication authentication) {
    try {
      EntityIdRequest request = EntityIdRequest.builder().id(id).build();
      setupRequest(request, authentication);
      StudentResponse response = studentService.getStudent(id);
      return buildOkResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.NOT_FOUND).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_ADMIN" })
  @Post(value = "/", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> createStudent(@RequestBean @Valid StudentRequest request, Authentication authentication) {
    try {
      setupRequest(request, authentication);
      StudentResponse response = studentService.createStudent(request);
      return buildCreatedResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_ADMIN" })
  @Put(value = "/{id}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> updateStudent(@RequestBean @Valid StudentRequest request, Authentication authentication) {
    try {
      setupRequest(request, authentication);
      StudentResponse response = studentService.updateStudent(request);
      return buildOkResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }

  @Secured({ "ROLE_ADMIN", "ROLE_USER" })
  @Delete(value = "/{id}", processes = MediaType.APPLICATION_JSON)
  public HttpResponse<?> deleteStudent(final Long id, Authentication authentication) {
    try {
      EntityIdRequest request = EntityIdRequest.builder().id(id).build();
      setupRequest(request, authentication);
      MessageResponse response = studentService.deleteStudent(id);
      return buildOkResponse(request, response);
    }
    catch (Exception error) {
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
    }
  }
}

package com.akurey.controllers;

import javax.validation.Valid;

import com.akurey.common.annotations.InjectAuthUser;
import com.akurey.common.exceptions.AKException;
import com.akurey.common.http.BaseController;
import com.akurey.common.models.EmptyRequest;
import com.akurey.common.models.EntityIdRequest;
import com.akurey.common.models.MessageResponse;
import com.akurey.models.Roles;
import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
import com.akurey.models.StudentsResponse;
import com.akurey.services.StudentService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.RequestBean;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@InjectAuthUser
@Controller("/v1/students")
@RequiredArgsConstructor
public class StudentController extends BaseController {

  private final StudentService studentService;

  @Operation(description = "Get a list of students")
  @ApiResponse(
      responseCode = "200",
      description = "The list of students",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = StudentsResponse.class))
  )
  @Secured(Roles.ADMIN)
  @Get(produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudents(@RequestBean @Valid EmptyRequest request, Authentication authentication)
      throws AKException {

    StudentsResponse response = studentService.getStudents();

    return buildOkResponse(request, response);
  }

  @Operation(description = "Get a single student")
  @ApiResponse(
      responseCode = "200",
      description = "The data of a single student",
      content = @Content(mediaType = MediaType.APPLICATION_JSON,
              schema = @Schema(implementation = StudentResponse.class))
  )
  @Secured(Roles.ADMIN)
  @Get(value = "/{id}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudent(@RequestBean @Valid EntityIdRequest request) throws AKException {

    StudentResponse response = studentService.getStudent(request.getId());
    return HttpResponse.ok(response);
  }

  @Operation(description = "Create a student")
  @ApiResponse(
      responseCode = "200",
      description = "The data of the new student",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = StudentResponse.class))
  )
  @Secured({ Roles.ADMIN })
  @Post(produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> createStudent(@RequestBean @Valid StudentRequest request) {

    StudentResponse response = studentService.createStudent(request);

    return buildCreatedResponse(request, response);
  }

  @Operation(description = "Update a student")
  @ApiResponse(
      responseCode = "200",
      description = "The data of the updated student",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, 
          schema = @Schema(implementation = StudentResponse.class))
  )
  @Secured({ Roles.ADMIN })
  @Put(value = "/{id}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> updateStudent(Long id, @RequestBean @Valid StudentRequest request) throws AKException {

    request.setId(id);
    StudentResponse response = studentService.updateStudent(request);

    return buildOkResponse(request, response);
  }

  @Operation(description = "Delete a student")
  @ApiResponse(
      responseCode = "200",
      description = "Success message",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = MessageResponse.class))
  )
  @Secured({ Roles.ADMIN, Roles.USER })
  @Delete(value = "/{id}", processes = MediaType.APPLICATION_JSON)
  public HttpResponse<?> deleteStudent(@RequestBean EntityIdRequest request) throws AKException {
    MessageResponse response = studentService.deleteStudent(request.getId());

    // return buildOkResponse(request, response);
    return HttpResponse.ok(response);
  }
}

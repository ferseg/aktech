package com.akurey.controllers;

import javax.validation.Valid;

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
import jakarta.inject.Inject;

@Controller("/v1/students")
public class StudentController extends BaseController {

  @Inject
  private StudentService studentService;

  // NOTE: Having an empty request seems to me like an overkill or hacky, just because buildOkResponse needs it
  @Operation(description = "Get a list of students")
  @ApiResponse(
      responseCode = "200",
      description = "The list of students",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = StudentsResponse.class))
  )
  @Secured({ Roles.USER, Roles.ADMIN })
  @Get(value = "/", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudents(@RequestBean @Valid EmptyRequest request, Authentication authentication)
      throws AKException {
    // NOTE: There is no need to setup request for an empty request
    setupRequest(request, authentication);
    StudentsResponse response = studentService.getStudents();

    return buildOkResponse(request, response);
  }

  @Operation(description = "Get a single student")
  @ApiResponse(
      responseCode = "200",
      description = "The data of a single student",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = StudentResponse.class))
  )
  @Secured({ Roles.USER, Roles.ADMIN })
  @Get(value = "/{id}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> getStudent(Long id, Authentication authentication) throws AKException {

    EntityIdRequest request = EntityIdRequest.builder().id(id).build();
    setupRequest(request, authentication);
    StudentResponse response = studentService.getStudent(id);

    return buildOkResponse(request, response);
  }

  @Operation(description = "Create a student")
  @ApiResponse(
      responseCode = "200",
      description = "The data of the new student",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = StudentResponse.class))
  )
  @Secured({ Roles.ADMIN })
  @Post(value = "/", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> createStudent(@RequestBean @Valid StudentRequest request, Authentication authentication) {

    setupRequest(request, authentication);
    StudentResponse response = studentService.createStudent(request);

    return buildCreatedResponse(request, response);
  }

  @Operation(description = "Update a student")
  @ApiResponse(
      responseCode = "200",
      description = "The data of the updated student",
      content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(implementation = StudentResponse.class))
  )
  @Secured({ Roles.ADMIN })
  @Put(value = "/{id}", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> updateStudent(Long id, @RequestBean @Valid StudentRequest request,
      Authentication authentication) throws AKException {

    request.setId(id);
    setupRequest(request, authentication);
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
  public HttpResponse<?> deleteStudent(Long id, Authentication authentication) throws AKException {

    EntityIdRequest request = EntityIdRequest.builder().id(id).build();
    setupRequest(request, authentication);
    MessageResponse response = studentService.deleteStudent(id);

    return buildOkResponse(request, response);
  }
}

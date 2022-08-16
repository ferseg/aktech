package com.akurey.controllers;

import java.util.List;

import com.akurey.models.StudentRequest;
import com.akurey.models.StudentResponse;
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
public class StudentController {
    @Inject StudentService studentService;

    @Secured({ "ROLE_USER", "ROLE_ADMIN" })
    @Get(value = "/", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> getStudents() {
        try {
            final List<StudentResponse> students = studentService.getStudents();
            return HttpResponse.status(HttpStatus.OK).body(students);
        } catch(Exception error) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
        }
        
    }

    @Secured({ "ROLE_USER", "ROLE_ADMIN" })
    @Get(value = "/{studentId}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> getStudent(final Long studentId) {
        try {
            return HttpResponse.status(HttpStatus.OK).body(studentService.getStudent(studentId));
        } catch (Exception error) {
            return HttpResponse.status(HttpStatus.NOT_FOUND).body(error.getMessage());
        }
    }

    @Secured({ "ROLE_ADMIN" })
    @Post(value = "/", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> createStudent(@Body StudentRequest student) {
        try {
            return HttpResponse.status(HttpStatus.CREATED).body(studentService.createStudent(student));
        } catch (Exception error) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
        }
    }

    @Secured({ "ROLE_ADMIN" })
    @Put(value = "/{studentId}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> updateStudent(@Body StudentRequest student, final Long studentId) {
        try {
            return HttpResponse.status(HttpStatus.OK).body(studentService.updateStudent(studentId, student));
        } catch (Exception error) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
        }
    }

    @Secured({ "ROLE_ADMIN", "ROLE_USER"})
    @Delete(value = "/{studentId}", processes = MediaType.APPLICATION_JSON)
    public HttpResponse<?> deleteStudent(final Long studentId) {
        try {
            return HttpResponse.status(HttpStatus.OK).body(studentService.deleteStudent(studentId));
        } catch (Exception error) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
        }
    }
}

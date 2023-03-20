package com.akurey.common.http.handlers;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ElementKind;
import javax.validation.Path;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.validation.exceptions.ConstraintExceptionHandler;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { ConstraintViolationException.class, ExceptionHandler.class })
@Replaces(ConstraintExceptionHandler.class)
public class AKConstraintViolationExceptionHandler extends BaseExceptionHandler
    implements ExceptionHandler<ConstraintViolationException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, ConstraintViolationException exception) {

    StringBuilder message = new StringBuilder();

    Set<ConstraintViolation<?>> constraintViolations = exception.getConstraintViolations();
    if ((constraintViolations != null) && !constraintViolations.isEmpty()) {
      constraintViolations.stream()
          .map(this::buildMessage)
          .forEach(message::append);
    }

    return handleBadRequest(request, exception, message.toString());
  }
  
  private String buildMessage(final ConstraintViolation<?> violation) {
    final Path propertyPath = violation.getPropertyPath();
    final String property = StreamSupport.stream(propertyPath.spliterator(), false)
          .filter(node -> node.getKind() != ElementKind.METHOD)
          .filter(node -> node.getKind() != ElementKind.CONSTRUCTOR)
          .map(Path.Node::toString)
          .collect(Collectors.joining("."));
    return String.format("%s: %s", property, violation.getMessage());
  } 

}

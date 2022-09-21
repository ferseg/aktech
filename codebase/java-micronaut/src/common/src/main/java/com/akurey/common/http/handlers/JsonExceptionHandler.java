package com.akurey.common.http.handlers;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { JsonProcessingException.class, io.micronaut.http.server.exceptions.ExceptionHandler.class })
@Replaces(io.micronaut.http.server.exceptions.JsonExceptionHandler.class)
public class JsonExceptionHandler extends ExceptionHandler
    implements io.micronaut.http.server.exceptions.ExceptionHandler<JsonProcessingException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, JsonProcessingException exception) {

    return handleBadRequest(request, exception);
  }

}

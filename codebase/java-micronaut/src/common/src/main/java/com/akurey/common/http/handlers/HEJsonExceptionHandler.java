package com.akurey.common.http.handlers;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.http.server.exceptions.JsonExceptionHandler;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { JsonProcessingException.class, ExceptionHandler.class })
@Replaces(JsonExceptionHandler.class)
public class HEJsonExceptionHandler extends HEExceptionHandler
    implements ExceptionHandler<JsonProcessingException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, JsonProcessingException exception) {

    return handleBadRequest(request, exception);
  }

}

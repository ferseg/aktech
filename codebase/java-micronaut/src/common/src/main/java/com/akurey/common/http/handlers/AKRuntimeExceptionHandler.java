package com.akurey.common.http.handlers;

import io.micronaut.context.annotation.Requires;
import io.micronaut.core.bind.exceptions.UnsatisfiedArgumentException;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { UnsatisfiedArgumentException.class, ExceptionHandler.class })
public class AKRuntimeExceptionHandler extends BaseExceptionHandler implements ExceptionHandler<RuntimeException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, RuntimeException exception) {

    return buildExceptionResponse(exception, request);
  }
}

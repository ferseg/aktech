package com.akurey.common.http.handlers;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.bind.exceptions.UnsatisfiedArgumentException;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { UnsatisfiedArgumentException.class, io.micronaut.http.server.exceptions.ExceptionHandler.class })
@Replaces(io.micronaut.http.server.exceptions.UnsatisfiedArgumentHandler.class)
public class UnsatisfiedArgumentHandler extends ExceptionHandler
    implements io.micronaut.http.server.exceptions.ExceptionHandler<UnsatisfiedArgumentException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, UnsatisfiedArgumentException exception) {

    return handleBadRequest(request, exception, exception.getMessage());
  }

}

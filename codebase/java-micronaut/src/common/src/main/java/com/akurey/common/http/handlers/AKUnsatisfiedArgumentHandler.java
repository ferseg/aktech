package com.akurey.common.http.handlers;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.bind.exceptions.UnsatisfiedArgumentException;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.http.server.exceptions.UnsatisfiedArgumentHandler;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { UnsatisfiedArgumentException.class, ExceptionHandler.class })
@Replaces(UnsatisfiedArgumentHandler.class)
public class AKUnsatisfiedArgumentHandler extends BaseExceptionHandler
    implements ExceptionHandler<UnsatisfiedArgumentException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, UnsatisfiedArgumentException exception) {

    return handleBadRequest(request, exception, exception.getMessage());
  }

}

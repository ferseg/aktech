package com.akurey.common.http.handlers;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.convert.exceptions.ConversionErrorException;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { ConversionErrorException.class, io.micronaut.http.server.exceptions.ExceptionHandler.class })
@Replaces(io.micronaut.http.server.exceptions.ConversionErrorHandler.class)
public class ConversionErrorHandler extends ExceptionHandler
    implements io.micronaut.http.server.exceptions.ExceptionHandler<ConversionErrorException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, ConversionErrorException exception) {

    return handleBadRequest(request, exception);
  }

}

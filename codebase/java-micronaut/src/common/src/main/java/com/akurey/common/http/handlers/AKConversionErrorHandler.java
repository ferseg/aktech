package com.akurey.common.http.handlers;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.core.convert.exceptions.ConversionErrorException;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ConversionErrorHandler;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { ConversionErrorException.class, ExceptionHandler.class })
@Replaces(ConversionErrorHandler.class)
public class AKConversionErrorHandler extends BaseExceptionHandler
    implements ExceptionHandler<ConversionErrorException, HttpResponse> {

  @Override
  public HttpResponse handle(HttpRequest request, ConversionErrorException exception) {

    return handleBadRequest(request, exception);
  }

}

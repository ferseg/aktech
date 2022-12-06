package com.akurey.common.http.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.akurey.common.exceptions.errors.UnauthenticatedError;
import com.akurey.common.models.RestResponse;

import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.security.authentication.AuthorizationException;
import io.micronaut.security.authentication.DefaultAuthorizationExceptionHandler;
import jakarta.inject.Singleton;

@SuppressWarnings("rawtypes")
@Produces
@Singleton
@Requires(classes = { AuthorizationException.class, ExceptionHandler.class })
@Replaces(DefaultAuthorizationExceptionHandler.class)
public class AKAuthorizationExceptionHandler extends BaseExceptionHandler
    implements ExceptionHandler<AuthorizationException, HttpResponse> {

  Logger logger = LoggerFactory.getLogger(AKAuthorizationExceptionHandler.class);

  /**
   * This handler replaces default DefaultAuthorizationExceptionHandler, which
   * handles redirect. In case redirect is needed, include its implementation.
   */
  @Override
  public HttpResponse handle(HttpRequest request, AuthorizationException exception) {

    logger.error("{} {}", UnauthenticatedError.UNAUTHENTICATED_ERROR.getMessage(),  exception.getMessage());

    RestResponse<?> response = new RestResponse<>();

    response.setErrorResponse(UnauthenticatedError.UNAUTHENTICATED_ERROR.getCode(),
        UnauthenticatedError.UNAUTHENTICATED_ERROR.getMessage());

    return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(response);
  }
}

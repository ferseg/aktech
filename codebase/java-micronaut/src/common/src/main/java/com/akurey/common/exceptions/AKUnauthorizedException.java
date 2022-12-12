package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthorizedError;

import io.micronaut.http.HttpStatus;

public class AKUnauthorizedException extends AKException {

  private static final long serialVersionUID = 1L;

  public AKUnauthorizedException() {
    super(UnauthorizedError.UNAUTHORIZED_ERROR);
  }

  public AKUnauthorizedException(UnauthorizedError error) {
    super(error);
  }

  public AKUnauthorizedException(UnauthorizedError error, Throwable cause) {
    super(error, cause);
  }

  public AKUnauthorizedException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  @Override
  public HttpStatus getHttpStatus() {
    return HttpStatus.FORBIDDEN;
  }
}

package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthenticatedError;

import io.micronaut.http.HttpStatus;

public class AKUnauthenticatedException extends AKException {

  private static final long serialVersionUID = 1L;

  public AKUnauthenticatedException() {
    super(UnauthenticatedError.UNAUTHENTICATED_ERROR);
  }

  public AKUnauthenticatedException(UnauthenticatedError error) {
    super(error);
  }

  public AKUnauthenticatedException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  public AKUnauthenticatedException(UnauthenticatedError error, Throwable cause) {
    super(error, cause);
  }

  @Override
  public HttpStatus getHttpStatus() {
    return HttpStatus.UNAUTHORIZED;
  }
}

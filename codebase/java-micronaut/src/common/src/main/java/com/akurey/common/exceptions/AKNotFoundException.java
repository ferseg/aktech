package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.NotFoundError;

import io.micronaut.http.HttpStatus;

public class AKNotFoundException extends AKException {

  private static final long serialVersionUID = 1L;

  public AKNotFoundException() {
    super(NotFoundError.NOT_FOUND_RESULT);
  }

  public AKNotFoundException(Throwable cause) {
    super(NotFoundError.NOT_FOUND_RESULT, cause);
  }

  @Override
  public HttpStatus getHttpStatus() {
    return HttpStatus.NOT_FOUND;
  }
}

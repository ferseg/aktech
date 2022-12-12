package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.BadRequestError;

import io.micronaut.http.HttpStatus;

public class AKBadRequestException extends AKException {

  private static final long serialVersionUID = 1L;

  public AKBadRequestException() {
    super(BadRequestError.BAD_REQUEST_ERROR);
  }

  public AKBadRequestException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  public AKBadRequestException(BadRequestError error, Throwable cause) {
    super(error, cause);
  }

  public AKBadRequestException(BadRequestError error) {
    super(error);
  }

  @Override
  public HttpStatus getHttpStatus() {
    return HttpStatus.BAD_REQUEST;
  }
}

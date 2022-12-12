package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.AKError;

import io.micronaut.http.HttpStatus;

public class AKDatabaseException extends AKException {

  public AKDatabaseException(AKError error) {
    super(error);
  }

  public AKDatabaseException(AKError error, Throwable cause) {
    super(error, cause);
  }

  public AKDatabaseException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  @Override
  public HttpStatus getHttpStatus() {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

}

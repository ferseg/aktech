package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthenticatedError;

public class UnauthenticatedException extends CustomException {

  private static final long serialVersionUID = 1L;

  public UnauthenticatedException() {
    super(UnauthenticatedError.UNAUTHENTICATED_ERROR);
  }

  public UnauthenticatedException(UnauthenticatedError error) {
    super(error);
  }

  public UnauthenticatedException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  public UnauthenticatedException(UnauthenticatedError error, Throwable cause) {
    super(error, cause);
  }
}

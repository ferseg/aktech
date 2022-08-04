package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthenticatedError;

public class HEUnauthenticatedException extends HEException {

  private static final long serialVersionUID = 1L;

  public HEUnauthenticatedException() {
    super(UnauthenticatedError.UNAUTHENTICATED_ERROR);
  }

  public HEUnauthenticatedException(UnauthenticatedError error) {
    super(error);
  }

  public HEUnauthenticatedException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  public HEUnauthenticatedException(UnauthenticatedError error, Throwable cause) {
    super(error, cause);
  }
}

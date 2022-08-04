package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthorizedError;

public class HEUnauthorizedException extends HEException {

  private static final long serialVersionUID = 1L;

  public HEUnauthorizedException() {
    super(UnauthorizedError.UNAUTHORIZED_ERROR);
  }

  public HEUnauthorizedException(UnauthorizedError error) {
    super(error);
  }

  public HEUnauthorizedException(UnauthorizedError error, Throwable cause) {
    super(error, cause);
  }

  public HEUnauthorizedException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }
}

package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthorizedError;

public class UnauthorizedException extends CustomException {

  private static final long serialVersionUID = 1L;

  public UnauthorizedException() {
    super(UnauthorizedError.UNAUTHORIZED_ERROR);
  }

  public UnauthorizedException(UnauthorizedError error) {
    super(error);
  }

  public UnauthorizedException(UnauthorizedError error, Throwable cause) {
    super(error, cause);
  }

  public UnauthorizedException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }
}

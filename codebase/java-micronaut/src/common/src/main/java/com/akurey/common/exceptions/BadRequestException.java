package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.BadRequestError;

public class BadRequestException extends CustomException {

  private static final long serialVersionUID = 1L;

  public BadRequestException() {
    super(BadRequestError.BAD_REQUEST_ERROR);
  }

  public BadRequestException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  public BadRequestException(BadRequestError error, Throwable cause) {
    super(error, cause);
  }

  public BadRequestException(BadRequestError error) {
    super(error);
  }
}

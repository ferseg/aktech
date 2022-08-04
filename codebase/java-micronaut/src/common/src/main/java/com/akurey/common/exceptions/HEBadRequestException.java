package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.BadRequestError;

public class HEBadRequestException extends HEException {

  private static final long serialVersionUID = 1L;

  public HEBadRequestException() {
    super(BadRequestError.BAD_REQUEST_ERROR);
  }

  public HEBadRequestException(String message, Throwable cause, int errorCode) {
    super(message, cause, errorCode);
  }

  public HEBadRequestException(BadRequestError error, Throwable cause) {
    super(error, cause);
  }

  public HEBadRequestException(BadRequestError error) {
    super(error);
  }
}

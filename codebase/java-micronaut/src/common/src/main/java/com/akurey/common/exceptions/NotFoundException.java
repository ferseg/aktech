package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.NotFoundError;

public class NotFoundException extends CustomException {

  private static final long serialVersionUID = 1L;

  public NotFoundException() {
    super(NotFoundError.NOT_FOUND_RESULT);
  }

  public NotFoundException(Throwable cause) {
    super(NotFoundError.NOT_FOUND_RESULT, cause);
  }
}

package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.NotFoundError;

public class HENotFoundException extends HEException {

  private static final long serialVersionUID = 1L;

  public HENotFoundException() {
    super(NotFoundError.NOT_FOUND_RESULT);
  }

  public HENotFoundException(Throwable cause) {
    super(NotFoundError.NOT_FOUND_RESULT, cause);
  }
}

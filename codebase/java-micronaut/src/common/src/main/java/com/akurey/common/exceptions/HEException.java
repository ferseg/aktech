package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.HEError;

public class HEException extends Exception {

  private static final long serialVersionUID = 1L;

  private int errorCode;

  public HEException(HEError error, Throwable cause) {
    super(error.getMessage(), cause);
    this.errorCode = error.getCode();
  }

  public HEException(HEError error) {
    super(error.getMessage());
    this.errorCode = error.getCode();
  }

  public HEException(String message, Throwable cause, int errorCode) {
    super(message, cause);
    this.errorCode = errorCode;
  }

  public HEException(String message) {
    super(message);
  }

  public int getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(int errorCode) {
    this.errorCode = errorCode;
  }
}

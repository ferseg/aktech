package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.CustomError;

public class CustomException extends Exception {

  private static final long serialVersionUID = 1L;

  private int errorCode;

  public CustomException(CustomError error, Throwable cause) {
    super(error.getMessage(), cause);
    this.errorCode = error.getCode();
  }

  public CustomException(CustomError error) {
    super(error.getMessage());
    this.errorCode = error.getCode();
  }

  public CustomException(String message, Throwable cause, int errorCode) {
    super(message, cause);
    this.errorCode = errorCode;
  }

  public CustomException(String message) {
    super(message);
  }

  public int getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(int errorCode) {
    this.errorCode = errorCode;
  }
}

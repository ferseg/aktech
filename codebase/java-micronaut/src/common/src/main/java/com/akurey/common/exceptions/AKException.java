package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.AKError;

import io.micronaut.http.HttpStatus;

public abstract class AKException extends Exception {

  private static final long serialVersionUID = 1L;

  private int errorCode;

  public AKException(AKError error, Throwable cause) {
    super(error.getMessage(), cause);
    this.errorCode = error.getCode();
  }

  public AKException(AKError error) {
    super(error.getMessage());
    this.errorCode = error.getCode();
  }

  public AKException(String message, Throwable cause, int errorCode) {
    super(message, cause);
    this.errorCode = errorCode;
  }

  public AKException(String message) {
    super(message);
  }

  public int getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(int errorCode) {
    this.errorCode = errorCode;
  }

  public abstract HttpStatus getHttpStatus();
}

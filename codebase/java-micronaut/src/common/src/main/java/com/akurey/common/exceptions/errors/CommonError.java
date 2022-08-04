package com.akurey.common.exceptions.errors;

public enum CommonError implements HEError {

  NOT_HANDLED_ERROR(29000, "Something went wrong. Please try again");

  private int code;
  private String message;

  CommonError(int code, String message) {
    this.code = code;
    this.message = message;
  }

  @Override
  public int getCode() {
    return code;
  }

  @Override
  public String getMessage() {
    return message;
  }

}

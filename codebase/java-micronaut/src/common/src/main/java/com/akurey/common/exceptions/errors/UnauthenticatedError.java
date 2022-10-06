package com.akurey.common.exceptions.errors;

public enum UnauthenticatedError implements AKError {

  UNAUTHENTICATED_ERROR(401, "You are not authorized to perform this action"),
  PASSWORD_RESET_ERROR(21000, "You need to reset your password");

  private int code;
  private String message;

  UnauthenticatedError(int code, String message) {
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

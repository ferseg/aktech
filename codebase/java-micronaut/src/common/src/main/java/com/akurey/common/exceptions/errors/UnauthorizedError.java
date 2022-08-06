package com.akurey.common.exceptions.errors;

public enum UnauthorizedError implements HEError {

  UNAUTHORIZED_ERROR(403, "You are not authorized to perform this action"),
  LOGIN_USER_ERROR(23000, "You are not authorized to login as user"),
  LOGIN_ADMIN_ERROR(23001, "You are not authorized to login as admin"),
  REFRESH_TOKEN_ERROR(23002, "The refresh token is invalid");

  private int code;
  private String message;

  UnauthorizedError(int code, String message) {
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

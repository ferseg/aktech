package com.akurey.common.exceptions.errors;

public enum NotFoundError implements CustomError {

  NOT_FOUND_RESULT(404, "Resource not found"),
  NEXT_CODE(24000, "Placeholder for next error code");

  private int code;
  private String message;

  NotFoundError(int code, String message) {
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

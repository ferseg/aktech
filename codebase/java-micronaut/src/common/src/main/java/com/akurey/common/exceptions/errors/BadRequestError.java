package com.akurey.common.exceptions.errors;

public enum BadRequestError implements HEError {

  BAD_REQUEST_ERROR(400, "Something is wrong in the request. "),
  NEXT_CODE(20000, "Placeholder for next error code");

  private int code;
  private String message;

  BadRequestError(int code, String message) {
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

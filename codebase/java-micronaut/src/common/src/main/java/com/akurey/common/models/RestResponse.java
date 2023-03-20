package com.akurey.common.models;

import com.fasterxml.jackson.annotation.JsonInclude;

// NOTE: I wouldn't use the same format for sucess and errors
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class RestResponse<T extends BaseResponse> {

  private boolean success;
  private T data;
  private ErrorResponse error;

  public RestResponse(T data) {
    this.success = true;
    this.data = data;
  }

  public void setErrorResponse(int code, String message) {
    this.success = false;
    this.error = new ErrorResponse(code, message);
  }

  public void setErrorResponse(ErrorResponse error) {
    this.success = false;
    this.error = error;
  }

  public RestResponse() {
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.success = true;
    this.data = data;
  }

  public ErrorResponse getError() {
    return error;
  }

  public void setError(ErrorResponse error) {
    this.success = false;
    this.error = error;
  }

}

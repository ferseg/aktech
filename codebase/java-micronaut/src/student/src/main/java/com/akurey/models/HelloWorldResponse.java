package com.akurey.models;

import com.akurey.common.models.BaseResponse;

public class HelloWorldResponse extends BaseResponse {

  private String message;

  public String getMessage() {
    return message;
  }

  public HelloWorldResponse setMessage(String message) {
    this.message = message;
    return this;
  }
}

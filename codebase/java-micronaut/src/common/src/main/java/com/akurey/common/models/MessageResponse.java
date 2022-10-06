package com.akurey.common.models;

public class MessageResponse extends BaseResponse {

  private String message = "The request was successful";

  public String getMessage() {
    return message;
  }

  public MessageResponse setMessage(String message) {
    this.message = message;
    return this;
  }

}

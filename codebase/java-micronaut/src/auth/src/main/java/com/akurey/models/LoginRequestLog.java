package com.akurey.models;

public class LoginRequestLog {

  private String username;

  public LoginRequestLog(LoginRequest request) {
    setUsername(request.getUsername());
  }

  public String getUsername() {
    return username;
  }

  public LoginRequestLog setUsername(String username) {
    this.username = username;
    return this;
  }
}

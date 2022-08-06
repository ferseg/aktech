package com.akurey.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;

@Introspected
public class LoginRequest extends BaseRequest {

  @NotBlank
  @Size(min = 1, max = 50)
  private String username;

  @NotBlank
  @Size(min = 1, max = 255)
  private String password;

  public String getUsername() {
    return username;
  }

  public LoginRequest setUsername(String username) {
    this.username = username;
    return this;
  }

  public String getPassword() {
    return password;
  }

  public LoginRequest setPassword(String password) {
    this.password = password;
    return this;
  }
}

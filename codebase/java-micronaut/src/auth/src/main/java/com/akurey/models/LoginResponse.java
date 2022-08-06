package com.akurey.models;

import com.akurey.common.models.BaseResponse;

public class LoginResponse extends BaseResponse {

  private String accessToken;

  private String refreshToken;

  public String getAccessToken() {
    return accessToken;
  }

  public LoginResponse setAccessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public LoginResponse setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}

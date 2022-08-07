package com.akurey.models;

import com.akurey.common.models.BaseResponse;

public class RefreshAuthTokenResponse extends BaseResponse {

  private String accessToken;

  private String refreshToken;

  public String getAccessToken() {
    return accessToken;
  }

  public RefreshAuthTokenResponse setAccessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public RefreshAuthTokenResponse setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}

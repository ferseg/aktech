package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.annotation.Header;

@Introspected
public class RefreshAuthTokenRequest extends BaseRequest {

  @Header("Authorization")
  private String authorizationHeader;

  public String getAuthorizationHeader() {
    return this.authorizationHeader;
  }

  public RefreshAuthTokenRequest setAuthorizationHeader(String value) {
    this.authorizationHeader = value;
    return this;
  }
}

package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.annotation.Header;

@Introspected
public class LogoutRequest extends BaseRequest {

  @Header("Authorization")
  private String authorizationHeader;

  public LogoutRequest setAuthorizationHeader(String value) {
    this.authorizationHeader = value;
    return this;
  }

  public String getAuthorizationHeader() {
    return this.authorizationHeader;
  }
}

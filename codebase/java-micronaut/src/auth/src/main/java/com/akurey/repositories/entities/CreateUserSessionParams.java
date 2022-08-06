package com.akurey.repositories.entities;

import com.akurey.common.repositories.BaseSPParams;
import com.akurey.common.repositories.StoredProcedureParam;
import com.akurey.common.repositories.StoredProcedureParams;

@StoredProcedureParams(storeProcedureName = "CoreSPCreateUserSession")
public class CreateUserSessionParams extends BaseSPParams {

  @StoredProcedureParam(name = "pUserIdentifier")
  private String userIdentifier;

  @StoredProcedureParam(name = "pAccessToken")
  private String accessToken;

  @StoredProcedureParam(name = "pRefreshToken")
  private String refreshToken;

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public CreateUserSessionParams setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
    return this;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public CreateUserSessionParams setAccessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public CreateUserSessionParams setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
    return this;
  }
}

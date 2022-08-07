package com.akurey.repositories.entities;

import com.akurey.common.repositories.BaseSPParams;
import com.akurey.common.repositories.StoredProcedureParam;
import com.akurey.common.repositories.StoredProcedureParams;

@StoredProcedureParams(storeProcedureName = "CoreSPGetUserWithRefreshToken")
public class GetUserWithRefreshTokenParams extends BaseSPParams {

  @StoredProcedureParam(name = "pRefreshToken")
  private String refreshToken;

  public String getRefreshToken() {
    return this.refreshToken;
  }

  public GetUserWithRefreshTokenParams setRefreshToken(String value) {
    this.refreshToken = value;
    return this;
  }
}

package com.akurey.repositories.entities;

import com.akurey.common.repositories.BaseSPParams;
import com.akurey.common.repositories.StoredProcedureParam;
import com.akurey.common.repositories.StoredProcedureParams;

@StoredProcedureParams(storeProcedureName = "CoreSPLogoutUser")
public class LogoutParams extends BaseSPParams {

  @StoredProcedureParam(name = "pAccessToken")
  private String accessToken;

  public String getAccessToken() {
    return accessToken;
  }

  public LogoutParams setAccessToken(String value) {
    this.accessToken = value;
    return this;
  }
}

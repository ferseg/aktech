package com.akurey.repositories.entities;

import com.akurey.common.repositories.BaseSPParams;
import com.akurey.common.repositories.StoredProcedureParam;
import com.akurey.common.repositories.StoredProcedureParams;

@StoredProcedureParams(storeProcedureName = "CoreSPLoginUser")
public class LoginParams extends BaseSPParams {

  @StoredProcedureParam(name = "pUserIdentifier")
  private String userIdentifier;

  @StoredProcedureParam(name = "pPassword")
  private String password;

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public LoginParams setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
    return this;
  }

  public String getPassword() {
    return password;
  }

  public LoginParams setPassword(String password) {
    this.password = password;
    return this;
  }
}

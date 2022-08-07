package com.akurey.repositories.entities;

import com.akurey.common.repositories.BaseSPParams;
import com.akurey.common.repositories.StoredProcedureParam;
import com.akurey.common.repositories.StoredProcedureParams;

@StoredProcedureParams(storeProcedureName = "CoreSPRefreshSession")
public class RefreshSessionParams extends BaseSPParams {

  @StoredProcedureParam(name = "pOldRefreshToken")
  private String oldRefreshToken;

  @StoredProcedureParam(name = "pSessionId")
  private Long sessionId;

  @StoredProcedureParam(name = "pUserId")
  private Long userId;

  @StoredProcedureParam(name = "pNewRefreshToken")
  private String newRefreshToken;

  @StoredProcedureParam(name = "pNewAuthToken")
  private String newAuthToken;

  public String getOldRefreshToken() {
    return this.oldRefreshToken;
  }

  public RefreshSessionParams setOldRefreshToken(String value) {
    this.oldRefreshToken = value;
    return this;
  }

  public Long getSessionId() {
    return this.sessionId;
  }

  public RefreshSessionParams setSessionId(Long value) {
    this.sessionId = value;
    return this;
  }

  public Long getUserId() {
    return this.userId;
  }

  public RefreshSessionParams setUserId(Long value) {
    this.userId = value;
    return this;
  }

  public String getNewRefreshToken() {
    return this.newRefreshToken;
  }

  public RefreshSessionParams setNewRefreshToken(String value) {
    this.newRefreshToken = value;
    return this;
  }

  public String getNewAuthToken() {
    return this.newAuthToken;
  }

  public RefreshSessionParams setNewAuthToken(String value) {
    this.newAuthToken = value;
    return this;
  }
}

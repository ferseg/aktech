package com.akurey.repositories.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.akurey.common.repositories.BaseSPResult;

@Entity
public class GetUserWithRefreshTokenResult extends BaseSPResult {

  @Id
  private Long userId;

  private Long sessionId;

  private String userName;

  private String roleCodes;

  public Long getUserId() {
    return this.userId;
  }

  public GetUserWithRefreshTokenResult setUserId(Long value) {
    this.userId = value;
    return this;
  }

  public Long getSessionId() {
    return this.sessionId;
  }

  public GetUserWithRefreshTokenResult setSessionId(Long value) {
    this.sessionId = value;
    return this;
  }

  public String getUserName() {
    return this.userName;
  }

  public GetUserWithRefreshTokenResult setUserName(String value) {
    this.userName = value;
    return this;
  }

  public String getRoleCodes() {
    return this.roleCodes;
  }

  public GetUserWithRefreshTokenResult setRoleCodes(String value) {
    this.roleCodes = value;
    return this;
  }
}

package com.akurey.repositories.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.akurey.common.repositories.BaseSPResult;

@Entity
public class LoginResult extends BaseSPResult {

  @Id
  private String roleCode;

  private String changePasswordToken;

  public String getRoleCode() {
    return roleCode;
  }

  public void setRoleCode(String roleCode) {
    this.roleCode = roleCode;
  }

  public String getChangePasswordToken() {
    return this.changePasswordToken;
  }

  public LoginResult setChangePasswordToken(String value) {
    this.changePasswordToken = value;
    return this;
  }

}

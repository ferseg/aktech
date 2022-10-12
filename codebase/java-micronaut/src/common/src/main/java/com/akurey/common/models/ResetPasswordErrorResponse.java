package com.akurey.common.models;

public class ResetPasswordErrorResponse extends ErrorResponse {

  private String changePasswordToken;

  public ResetPasswordErrorResponse(int code, String message, String changePasswordToken) {
    super(code, message);
    this.setChangePasswordToken(changePasswordToken);
  }

  public String getChangePasswordToken() {
    return changePasswordToken;
  }

  public void setChangePasswordToken(String changePasswordToken) {
    this.changePasswordToken = changePasswordToken;
  }
}

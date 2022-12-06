package com.akurey.common.exceptions;

import com.akurey.common.exceptions.errors.UnauthenticatedError;

public class AKResetPasswordException extends AKUnauthenticatedException {
    
    private static final long serialVersionUID = 1L;
    
    private String changePasswordToken;
    
    public AKResetPasswordException(UnauthenticatedError error, String changePasswordToken) {
        super(error);
        this.setChangePasswordToken(changePasswordToken);
    }
    
    public String getChangePasswordToken() {
        return changePasswordToken;
    }
    
    public void setChangePasswordToken(String changePasswordToken) {
        this.changePasswordToken = changePasswordToken;
    }
}

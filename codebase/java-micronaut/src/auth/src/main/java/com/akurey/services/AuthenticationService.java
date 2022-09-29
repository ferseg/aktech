package com.akurey.services;

import com.akurey.common.exceptions.AKException;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.models.LogoutRequest;
import com.akurey.models.LogoutResponse;
import com.akurey.models.RefreshAuthTokenRequest;
import com.akurey.models.RefreshAuthTokenResponse;

public interface AuthenticationService {

  LoginResponse login(LoginRequest request) throws AKException;

  LogoutResponse logout(LogoutRequest request) throws AKException;

  RefreshAuthTokenResponse refreshAuthToken(RefreshAuthTokenRequest request) throws AKException;
}

package com.akurey.services;

import com.akurey.common.exceptions.HEException;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.models.LogoutRequest;
import com.akurey.models.LogoutResponse;
import com.akurey.models.RefreshAuthTokenRequest;
import com.akurey.models.RefreshAuthTokenResponse;

public interface AuthenticationService {

  LoginResponse login(LoginRequest request) throws HEException;

  LogoutResponse logout(LogoutRequest request) throws HEException;

  RefreshAuthTokenResponse refreshAuthToken(RefreshAuthTokenRequest request) throws HEException;
}

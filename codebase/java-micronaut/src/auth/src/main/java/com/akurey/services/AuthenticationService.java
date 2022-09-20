package com.akurey.services;

import com.akurey.common.exceptions.CustomException;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.models.LogoutRequest;
import com.akurey.models.LogoutResponse;
import com.akurey.models.RefreshAuthTokenRequest;
import com.akurey.models.RefreshAuthTokenResponse;

public interface AuthenticationService {

  LoginResponse login(LoginRequest request) throws CustomException;

  LogoutResponse logout(LogoutRequest request) throws CustomException;

  RefreshAuthTokenResponse refreshAuthToken(RefreshAuthTokenRequest request) throws CustomException;
}

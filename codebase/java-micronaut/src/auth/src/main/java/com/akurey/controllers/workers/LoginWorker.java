package com.akurey.controllers.workers;

import com.akurey.common.http.BaseWorker;
import com.akurey.common.logs.CustomLogger;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginRequestLog;
import com.akurey.models.LoginResponse;
import com.akurey.services.AuthenticationService;

import jakarta.inject.Inject;

public class LoginWorker extends BaseWorker<LoginRequest, LoginResponse> {

  @Inject
  private AuthenticationService service;

  @Override
  protected LoginResponse executeImpl(LoginRequest request) throws Exception {

    LoginResponse response = service.login(request);

    CustomLogger.logRequestSuccess(this, getFilteredRequest(request));

    return response;
  }

  @Override
  protected Object getFilteredRequest(LoginRequest request) {
    return new LoginRequestLog(request);
  }
}

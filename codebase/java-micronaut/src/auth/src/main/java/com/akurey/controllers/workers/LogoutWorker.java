package com.akurey.controllers.workers;

import com.akurey.common.http.BaseWorker;
import com.akurey.common.logs.HELogger;
import com.akurey.models.LogoutRequest;
import com.akurey.models.LogoutResponse;
import com.akurey.services.AuthenticationService;

import jakarta.inject.Inject;

public class LogoutWorker extends BaseWorker<LogoutRequest, LogoutResponse> {

  @Inject private AuthenticationService service;

  @Override
  protected LogoutResponse executeImpl(LogoutRequest request) throws Exception {
    LogoutResponse response = service.logout(request);
    HELogger.logRequestSuccess(this, request);
    return response;
  }
}

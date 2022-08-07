package com.akurey.controllers.workers;

import com.akurey.common.http.BaseWorker;
import com.akurey.common.logs.HELogger;
import com.akurey.models.LogoutResponse;
import com.akurey.models.RefreshAuthTokenRequest;
import com.akurey.models.RefreshAuthTokenResponse;
import com.akurey.services.AuthenticationService;

import jakarta.inject.Inject;

public class RefreshAuthTokenWorker extends BaseWorker<RefreshAuthTokenRequest, RefreshAuthTokenResponse> {

  @Inject private AuthenticationService service;

  @Override
  protected RefreshAuthTokenResponse executeImpl(RefreshAuthTokenRequest request) throws Exception {
    RefreshAuthTokenResponse response = service.refreshAuthToken(request);
    HELogger.logRequestSuccess(this, request);
    return response;
  }
}

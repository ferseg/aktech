package com.akurey.controllers.workers;

import com.akurey.common.http.BaseWorker;
import com.akurey.common.logs.HELogger;
import com.akurey.models.HelloWorldRequest;
import com.akurey.models.HelloWorldResponse;
import com.akurey.services.HelloWorldService;

import jakarta.inject.Inject;

public class HelloWorldWorker extends BaseWorker<HelloWorldRequest, HelloWorldResponse> {

  @Inject private HelloWorldService service;

  @Override
  protected HelloWorldResponse executeImpl(HelloWorldRequest request) throws Exception {
    HelloWorldResponse response = service.helloWorld(request);
    HELogger.logRequestSuccess(this, request);
    return response;
  }
}

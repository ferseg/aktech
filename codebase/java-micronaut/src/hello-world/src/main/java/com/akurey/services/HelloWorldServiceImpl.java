package com.akurey.services;

import com.akurey.common.exceptions.HEException;
import com.akurey.models.HelloWorldRequest;
import com.akurey.models.HelloWorldResponse;

import jakarta.inject.Singleton;

@Singleton
public class HelloWorldServiceImpl implements HelloWorldService {

  @Override
  public HelloWorldResponse helloWorld(HelloWorldRequest request) throws HEException {
    return new HelloWorldResponse()
        .setMessage("Hello " + request.getName() + "!");
  }
}

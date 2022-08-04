package com.akurey.services;

import com.akurey.common.exceptions.HEException;
import com.akurey.models.HelloWorldRequest;
import com.akurey.models.HelloWorldResponse;

public interface HelloWorldService {

  HelloWorldResponse helloWorld(HelloWorldRequest request) throws HEException;
}

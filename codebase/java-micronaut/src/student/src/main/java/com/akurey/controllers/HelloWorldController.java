package com.akurey.controllers;

import javax.validation.Valid;

import com.akurey.controllers.workers.HelloWorldWorker;
import com.akurey.models.HelloWorldRequest;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.RequestBean;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.inject.Inject;

@Controller("/v1/hello")
@Secured(SecurityRule.IS_ANONYMOUS)
public class HelloWorldController {

  @Inject private HelloWorldWorker helloWorldWorker;

  @Get(produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> hello(@RequestBean @Valid HelloWorldRequest request) {
    return helloWorldWorker.execute(request);
  }
}

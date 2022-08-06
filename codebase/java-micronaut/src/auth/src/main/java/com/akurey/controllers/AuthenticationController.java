package com.akurey.controllers;

import javax.validation.Valid;

import com.akurey.controllers.workers.LoginWorker;
import com.akurey.models.LoginRequest;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.RequestBean;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.inject.Inject;

@Controller("/v1/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
public class AuthenticationController {

  @Inject private LoginWorker loginWorker;

  @Post(value = "/login", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> login(@RequestBean @Valid LoginRequest request) {
    return loginWorker.execute(request);
  }

  // TODO: Implement other methods

  //  @Secured(SecurityRule.IS_AUTHENTICATED)
  //  @Post(value = "/logout", produces = MediaType.APPLICATION_JSON)
  //  public HttpResponse<?> logoutStudent(@RequestBean @Valid LogoutRequest request, Authentication authentication) {
  //    return logoutWorker.execute(request);
  //  }
  //
  //  @Post(value = "/token", produces = MediaType.APPLICATION_JSON)
  //  public HttpResponse<?> refreshAuthToken(@RequestBean @Valid RefreshAuthTokenRequest request) {
  //    return refreshAuthTokenWorker.execute(request);
  //  }
  //
  //  @Secured(SecurityRule.IS_ANONYMOUS)
  //  @Post(value = "/forgottenpassword", produces = MediaType.APPLICATION_JSON)
  //  public HttpResponse<?> handleForgottenPassword(@RequestBean @Valid CreateTemporaryPasswordRequest request) {
  //
  //    return forgottenPasswordWorker.execute(request);
  //  }
}

package com.akurey.controllers;

import javax.validation.Valid;

import com.akurey.common.exceptions.CustomException;
import com.akurey.common.http.BaseController;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.models.LogoutRequest;
import com.akurey.models.LogoutResponse;
import com.akurey.models.RefreshAuthTokenRequest;
import com.akurey.models.RefreshAuthTokenResponse;
import com.akurey.services.AuthenticationService;

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
public class AuthenticationController extends BaseController {

  @Inject
  private AuthenticationService service;

  @Post(value = "/login", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> login(@RequestBean @Valid LoginRequest request) {
    try {
      LoginResponse response = service.login(request);
      return buildOkResponse(request, response);
    }
    catch (CustomException e) {
      return buildExceptionResponse(e, request);
    }
  }

  @Secured(SecurityRule.IS_AUTHENTICATED)
  @Post(value = "/logout", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> logoutStudent(@RequestBean @Valid LogoutRequest request) {
    try {
      LogoutResponse response = service.logout(request);
      return buildOkResponse(request, response);
    }
    catch (CustomException e) {
      return buildExceptionResponse(e, request);
    }
  }

  @Post(value = "/token/refresh", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> refreshAuthToken(@RequestBean @Valid RefreshAuthTokenRequest request) {
    try {
      RefreshAuthTokenResponse response = service.refreshAuthToken(request);
      return buildOkResponse(request, response);
    }
    catch (CustomException e) {
      return buildExceptionResponse(e, request);
    }
  }

  // TODO: Add forgot password flow
}

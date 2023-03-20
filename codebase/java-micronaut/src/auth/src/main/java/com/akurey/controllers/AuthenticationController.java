package com.akurey.controllers;

import javax.validation.Valid;

import com.akurey.common.exceptions.AKException;
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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.inject.Inject;

@Controller("/v1/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
public class AuthenticationController extends BaseController {

  @Inject
  private AuthenticationService service;

  // NOTE: It is always better to return the specific type if possible for the HttpResponse
  @Operation(description = "Authenticates a user using username and password")
  @ApiResponse(
      responseCode = "200",
      description = "Access and refresh tokens",
      content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))
  )
  @Post(value = "/login", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> login(@RequestBean @Valid LoginRequest request) throws AKException {

    LoginResponse response = service.login(request);
    return buildOkResponse(request, response);
  }

  @Operation(description = "Logs out a user")
  @ApiResponse(
      responseCode = "200",
      description = "Success message",
      content = @Content(mediaType = "application/json", schema = @Schema(implementation = LogoutResponse.class))
  )
  @Secured(SecurityRule.IS_AUTHENTICATED)
  @Post(value = "/logout", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> logoutStudent(@RequestBean @Valid LogoutRequest request) throws AKException {

    LogoutResponse response = service.logout(request);
    return buildOkResponse(request, response);
  }

  @Operation(description = "Refreshes the access token for a user")
  @ApiResponse(
      responseCode = "200",
      description = "Access and refresh tokens",
      content = @Content(mediaType = "application/json", schema = @Schema(implementation = RefreshAuthTokenResponse.class))
  )
  @Post(value = "/token/refresh", produces = MediaType.APPLICATION_JSON)
  public HttpResponse<?> refreshAuthToken(@RequestBean @Valid RefreshAuthTokenRequest request) throws AKException {

    RefreshAuthTokenResponse response = service.refreshAuthToken(request);
    return buildOkResponse(request, response);
  }

  // TODO: Add forgot password flow
}

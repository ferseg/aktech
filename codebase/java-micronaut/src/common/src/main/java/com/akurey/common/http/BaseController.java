package com.akurey.common.http;

import java.util.ArrayList;

import com.akurey.common.exceptions.AKBadRequestException;
import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.AKNotFoundException;
import com.akurey.common.exceptions.AKUnauthenticatedException;
import com.akurey.common.exceptions.AKUnauthorizedException;
import com.akurey.common.logs.AKLogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.RestResponse;
import com.akurey.common.models.UserAuth;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.security.authentication.Authentication;

public class BaseController {

  protected <TRequest extends BaseRequest> void setupRequest(TRequest request, Authentication authentication) {
    if (authentication != null) {
      UserAuth user = UserAuth.builder()
          .userIdentifier(authentication.getName())
          .roles(new ArrayList<>(authentication.getRoles()))
          .build();

      request.setUser(user);
    }
  }

  protected <TRequest extends BaseRequest, TResponse extends BaseResponse> HttpResponse<RestResponse<TResponse>> buildOkResponse(
      TRequest request, TResponse responseBody) {
    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setData(responseBody);
    AKLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.OK).body(response);
  }

  protected <TRequest extends BaseRequest, TResponse extends BaseResponse> HttpResponse<RestResponse<TResponse>> buildCreatedResponse(
      TRequest request, TResponse responseBody) {
    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setData(responseBody);
    AKLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.CREATED).body(response);
  }

  protected <TRequest extends BaseRequest> HttpResponse<?> buildNoContentResponse(TRequest request) {
    AKLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.NO_CONTENT);
  }

  protected <TResponse extends BaseResponse> MutableHttpResponse<RestResponse<TResponse>> buildExceptionResponse(
      AKException e, Object request) {
    AKLogger.logRequestFailure(this, e, request);

    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setErrorResponse(e.getErrorCode(), e.getMessage());

    HttpStatus status;
    if (e instanceof AKBadRequestException) {
      status = HttpStatus.BAD_REQUEST;
    }
    else if (e instanceof AKUnauthenticatedException) {
      status = HttpStatus.UNAUTHORIZED;
    }
    else if (e instanceof AKUnauthorizedException) {
      status = HttpStatus.FORBIDDEN;
    }
    else if (e instanceof AKNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    }
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return HttpResponse.status(status).body(response);
  }
}

package com.akurey.common.http;

import java.util.ArrayList;

import com.akurey.common.logs.AKLogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.RestResponse;
import com.akurey.common.models.UserAuth;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
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
    return HttpResponse.ok(response);
  }

  protected <TRequest extends BaseRequest, TResponse extends BaseResponse> HttpResponse<RestResponse<TResponse>> buildCreatedResponse(
      TRequest request, TResponse responseBody) {
    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setData(responseBody);
    AKLogger.logRequestSuccess(this, request);
    return HttpResponse.created(response);
  }

  protected <TRequest extends BaseRequest> HttpResponse<?> buildNoContentResponse(TRequest request) {
    AKLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.NO_CONTENT);
  }
}

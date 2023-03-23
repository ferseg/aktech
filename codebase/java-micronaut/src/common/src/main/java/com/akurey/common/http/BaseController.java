package com.akurey.common.http;

import com.akurey.common.logs.AKLogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.RestResponse;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;

public class BaseController {

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

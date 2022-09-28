package com.akurey.common.http;

import com.akurey.common.exceptions.BadRequestException;
import com.akurey.common.exceptions.CustomException;
import com.akurey.common.exceptions.NotFoundException;
import com.akurey.common.exceptions.UnauthenticatedException;
import com.akurey.common.exceptions.UnauthorizedException;
import com.akurey.common.logs.CustomLogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.RestResponse;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MutableHttpResponse;

public class BaseController {

  protected <TRequest extends BaseRequest, TResponse extends BaseResponse> HttpResponse<RestResponse<TResponse>> buildOkResponse(
      TRequest request, TResponse responseBody) {

    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setData(responseBody);
    CustomLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.OK).body(response);
  }

  protected <TRequest extends BaseRequest, TResponse extends BaseResponse> HttpResponse<RestResponse<TResponse>> buildCreatedResponse(
      TRequest request, TResponse responseBody) {
    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setData(responseBody);
    CustomLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.CREATED).body(response);
  }

  protected <TRequest extends BaseRequest> HttpResponse<?> buildNoContentResponse(TRequest request) {
    CustomLogger.logRequestSuccess(this, request);
    return HttpResponse.status(HttpStatus.NO_CONTENT);
  }

  protected <TResponse extends BaseResponse> MutableHttpResponse<RestResponse<TResponse>> buildExceptionResponse(
      CustomException e, Object request) {
    CustomLogger.logRequestFailure(this, e, request);

    RestResponse<TResponse> response = new RestResponse<TResponse>();
    response.setErrorResponse(e.getErrorCode(), e.getMessage());

    HttpStatus status;
    if (e instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
    }
    else if (e instanceof UnauthenticatedException) {
      status = HttpStatus.UNAUTHORIZED;
    }
    else if (e instanceof UnauthorizedException) {
      status = HttpStatus.FORBIDDEN;
    }
    else if (e instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
    }
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return HttpResponse.status(status).body(response);
  }
}

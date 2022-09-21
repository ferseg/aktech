package com.akurey.common.http.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.akurey.common.exceptions.errors.BadRequestError;
import com.akurey.common.models.RestResponse;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;

public abstract class ExceptionHandler {

  Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);

  protected HttpResponse<RestResponse<?>> handleBadRequest(HttpRequest<?> request, Exception exception,
      String message) {

    RestResponse<?> response = new RestResponse<>();

    response.setErrorResponse(BadRequestError.BAD_REQUEST_ERROR.getCode(),
        BadRequestError.BAD_REQUEST_ERROR.getMessage() + message);

    logger.error(BadRequestError.BAD_REQUEST_ERROR.getMessage() + exception.getMessage());

    return HttpResponse.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @SuppressWarnings("rawtypes")
  protected HttpResponse handleBadRequest(HttpRequest request, Exception exception) {

    return handleBadRequest(request, exception, "");
  }
}

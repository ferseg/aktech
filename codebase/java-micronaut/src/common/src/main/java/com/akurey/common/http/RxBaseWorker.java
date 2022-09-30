package com.akurey.common.http;

import java.util.ArrayList;

import com.akurey.common.exceptions.AKBadRequestException;
import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.AKNotFoundException;
import com.akurey.common.exceptions.AKUnauthenticatedException;
import com.akurey.common.exceptions.AKUnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;
import com.akurey.common.logs.AKLogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.RestResponse;
import com.akurey.common.models.UserAuth;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.security.authentication.Authentication;
import reactor.core.publisher.Mono;

public abstract class RxBaseWorker<TRequest extends BaseRequest, TResponse extends BaseResponse> {

  public final Mono<HttpResponse<?>> execute(TRequest request) {
    return execute(request, null);
  }

  public final Mono<HttpResponse<?>> execute(TRequest request, Authentication authentication) {
    if (authentication != null) {
      UserAuth user = UserAuth.builder()
          .userIdentifier(authentication.getName())
          .roles(new ArrayList<>(authentication.getRoles()))
          .build();

      request.setUser(user);
    }

    return executeRx(request)
        .flatMap(response -> {
          Mono<HttpResponse<?>> mono = Mono.just(HttpResponse.status(HttpStatus.OK).body(response));
          return mono;
        })
        .onErrorResume(e -> {
          return handleError(e, request);
        });
  }

  private Mono<RestResponse<TResponse>> executeRx(TRequest request) {
    try {
      return executeImpl(request).flatMap(data -> {
        RestResponse<TResponse> response = new RestResponse<TResponse>();

        response.setData(data);

        return Mono.just(response);
      });
    }
    catch (Exception e) {
      return Mono.error(e);
    }
  }

  private Mono<HttpResponse<RestResponse<TResponse>>> handleError(Throwable error, TRequest request) {
    RestResponse<TResponse> response = new RestResponse<TResponse>();

    if (error instanceof AKException) {
      AKException e = (AKException) error;
      AKLogger.logRequestFailure(this, e, getFilteredRequest(request));

      if (e instanceof AKBadRequestException) {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.BAD_REQUEST).body(response));
      }
      else if (e instanceof AKUnauthenticatedException) {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.UNAUTHORIZED).body(response));
      }
      else if (e instanceof AKUnauthorizedException) {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.FORBIDDEN).body(response));
      }
      else if (e instanceof AKNotFoundException) {
        response.setErrorResponse(HttpStatus.NOT_FOUND.getCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.NOT_FOUND).body(response));
      }
      else {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response));
      }
    }

    AKLogger.logRequestFailure(this, new AKException(CommonError.NOT_HANDLED_ERROR, error),
        getFilteredRequest(request));
    response.setErrorResponse(CommonError.NOT_HANDLED_ERROR.getCode(), CommonError.NOT_HANDLED_ERROR.getMessage());
    return Mono.just(HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response));
  }

  protected abstract Mono<TResponse> executeImpl(TRequest request) throws Exception;

  /**
   * Override this method if sensitive info needs to be removed from logs
   *
   * @param request
   * @return filtered request
   */
  protected Object getFilteredRequest(TRequest request) {
    return request;
  }
}

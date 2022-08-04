package com.akurey.common.http;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;

import com.akurey.common.exceptions.HEBadRequestException;
import com.akurey.common.exceptions.HEException;
import com.akurey.common.exceptions.HENotFoundException;
import com.akurey.common.exceptions.HEUnauthenticatedException;
import com.akurey.common.exceptions.HEUnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;
import com.akurey.common.logs.HELogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.RestResponse;
import com.akurey.common.models.UserAuth;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.security.authentication.Authentication;
import reactor.core.publisher.Mono;

public abstract class RxFileBaseWorker<TRequest extends BaseRequest> {

  public final Mono<HttpResponse<?>> execute(TRequest request) {
    return execute(request, null);
  }

  public final Mono<HttpResponse<?>> execute(TRequest request, Authentication authentication) {

    if (authentication != null) {
      UserAuth user = new UserAuth()
          .setUserIdentifier(authentication.getName())
          .setRoles(new ArrayList<String>(authentication.getRoles()));

      if ((authentication.getAttributes() != null)
          && authentication.getAttributes().containsKey(UserAuth.DEVICE_ID_KEY)) {
        user.setDeviceId(authentication.getAttributes().get(UserAuth.DEVICE_ID_KEY).toString());
      }
      request.setUser(user);
    }

    return executeRx(request)
        .flatMap(file -> {
          byte[] fileData;
          try {
            fileData = Files.readAllBytes(file.toPath());
          }
          catch (IOException e) {
            return handleError(e, request);
          }

          Mono<HttpResponse<?>> mono = Mono.just(HttpResponse
              .status(HttpStatus.OK)
              .header("Content-disposition", "attachment; filename=\"" + file.getName() + "\"")
              .body(fileData));

          file.delete();

          return mono;
        })
        .onErrorResume(e -> {
          return handleError(e, request);
        });
  }

  private Mono<File> executeRx(TRequest request) {
    try {
      return executeImpl(request).flatMap(Mono::just);
    }
    catch (Exception e) {
      return Mono.error(e);
    }
  }

  private Mono<HttpResponse<RestResponse<BaseResponse>>> handleError(Throwable error, TRequest request) {
    RestResponse<BaseResponse> response = new RestResponse<BaseResponse>();

    if (error instanceof HEException) {
      HEException e = (HEException) error;
      HELogger.logRequestFailure(this, e, getFilteredRequest(request));

      if (e instanceof HEBadRequestException) {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.BAD_REQUEST)
            .header("Content-type", MediaType.APPLICATION_JSON).body(response));
      }
      else if (e instanceof HEUnauthenticatedException) {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.UNAUTHORIZED)
            .header("Content-type", MediaType.APPLICATION_JSON).body(response));
      }
      else if (e instanceof HEUnauthorizedException) {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.FORBIDDEN)
            .header("Content-type", MediaType.APPLICATION_JSON).body(response));
      }
      else if (e instanceof HENotFoundException) {
        response.setErrorResponse(HttpStatus.NOT_FOUND.getCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.NOT_FOUND)
            .header("Content-type", MediaType.APPLICATION_JSON).body(response));
      }
      else {
        response.setErrorResponse(e.getErrorCode(), e.getMessage());
        return Mono.just(HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .header("Content-type", MediaType.APPLICATION_JSON).body(response));
      }
    }

    HELogger.logRequestFailure(this, new HEException(CommonError.NOT_HANDLED_ERROR, error),
        getFilteredRequest(request));
    response.setErrorResponse(CommonError.NOT_HANDLED_ERROR.getCode(), CommonError.NOT_HANDLED_ERROR.getMessage());
    return Mono.just(HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .header("Content-type", MediaType.APPLICATION_JSON).body(response));
  }

  protected abstract Mono<File> executeImpl(TRequest request) throws Exception;

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

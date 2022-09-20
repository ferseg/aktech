package com.akurey.common.http;

import java.util.ArrayList;

import com.akurey.common.exceptions.BadRequestException;
import com.akurey.common.exceptions.CustomException;
import com.akurey.common.exceptions.NotFoundException;
import com.akurey.common.exceptions.ResetPasswordException;
import com.akurey.common.exceptions.UnauthenticatedException;
import com.akurey.common.exceptions.UnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;
import com.akurey.common.logs.CustomLogger;
import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.BaseResponse;
import com.akurey.common.models.ResetPasswordErrorResponse;
import com.akurey.common.models.RestResponse;
import com.akurey.common.models.UserAuth;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.security.authentication.Authentication;

public abstract class BaseWorker<TRequest extends BaseRequest, TResponse extends BaseResponse> {

  public final HttpResponse<?> execute(TRequest request) {
    return execute(request, null);
  }

  public final HttpResponse<?> execute(TRequest request, Authentication authentication) {

    if (authentication != null) {
      UserAuth user = new UserAuth()
          .setUserIdentifier(authentication.getName())
          .setRoles(new ArrayList<String>(authentication.getRoles()));

      request.setUser(user);
    }

    RestResponse<TResponse> response = new RestResponse<TResponse>();

    try {
      TResponse data = executeImpl(request);
      response.setData(data);
      return HttpResponse.status(HttpStatus.OK).body(response);
    }
    catch (BadRequestException e) {
      CustomLogger.logRequestFailure(this, e, getFilteredRequest(request));
      response.setErrorResponse(e.getErrorCode(), e.getMessage());
      return HttpResponse.status(HttpStatus.BAD_REQUEST).body(response);
    }
    catch (ResetPasswordException e) {
      CustomLogger.logRequestFailure(this, e, getFilteredRequest(request));
      ResetPasswordErrorResponse errorResponse = new ResetPasswordErrorResponse(e.getErrorCode(), e.getMessage(),
          e.getChangePasswordToken());
      response.setErrorResponse(errorResponse);
      return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    catch (UnauthenticatedException e) {
      CustomLogger.logRequestFailure(this, e, getFilteredRequest(request));
      response.setErrorResponse(e.getErrorCode(), e.getMessage());
      return HttpResponse.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    catch (UnauthorizedException e) {
      CustomLogger.logRequestFailure(this, e, getFilteredRequest(request));
      response.setErrorResponse(e.getErrorCode(), e.getMessage());
      return HttpResponse.status(HttpStatus.FORBIDDEN).body(response);
    }
    catch (NotFoundException e) {
      CustomLogger.logRequestFailure(this, e, getFilteredRequest(request));
      response.setErrorResponse(HttpStatus.NOT_FOUND.getCode(), e.getMessage());
      return HttpResponse.status(HttpStatus.NOT_FOUND).body(response);
    }
    catch (CustomException e) {
      CustomLogger.logRequestFailure(this, e, getFilteredRequest(request));
      response.setErrorResponse(e.getErrorCode(), e.getMessage());
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    catch (Exception e) {
      CustomLogger.logRequestFailure(this, new CustomException(CommonError.NOT_HANDLED_ERROR, e), getFilteredRequest(request));
      response.setErrorResponse(CommonError.NOT_HANDLED_ERROR.getCode(), CommonError.NOT_HANDLED_ERROR.getMessage());
      return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  protected abstract TResponse executeImpl(TRequest request) throws Exception;

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

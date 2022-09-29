package com.akurey.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.AKResetPasswordException;
import com.akurey.common.exceptions.AKUnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;
import com.akurey.common.exceptions.errors.UnauthenticatedError;
import com.akurey.common.exceptions.errors.UnauthorizedError;
import com.akurey.common.user.models.UserRole;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.models.LogoutRequest;
import com.akurey.models.LogoutResponse;
import com.akurey.models.RefreshAuthTokenRequest;
import com.akurey.models.RefreshAuthTokenResponse;
import com.akurey.repositories.AuthenticationRepository;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;
import com.akurey.repositories.entities.LogoutParams;
import com.akurey.repositories.entities.RefreshSessionParams;

import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.authentication.ServerAuthentication;
import io.micronaut.security.token.jwt.generator.AccessRefreshTokenGenerator;
import io.micronaut.security.token.jwt.render.AccessRefreshToken;
import io.micronaut.security.token.validator.RefreshTokenValidator;
import jakarta.inject.Inject;

public class AuthenticationServiceImpl implements AuthenticationService {

  @Inject
  private AccessRefreshTokenGenerator tokenGenerator;
  @Inject
  private RefreshTokenValidator refreshTokenValidator;
  @Inject
  private AuthenticationRepository repository;

  @Override
  public LoginResponse login(LoginRequest request) throws AKException {

    // Login
    LoginParams params = new LoginParams()
        .setUserIdentifier(request.getUsername())
        .setPassword(request.getPassword());

    LoginResult result = repository.login(params);

    if (!result.getRoleCode().contentEquals(UserRole.ROLE_USER.getCode()) &&
        !result.getRoleCode().contentEquals(UserRole.ROLE_ADMIN.getCode())) {
      throw new AKUnauthorizedException(UnauthorizedError.LOGIN_USER_ERROR);
    }

    if (result.getChangePasswordToken() != null) {
      throw new AKResetPasswordException(UnauthenticatedError.PASSWORD_RESET_ERROR, result.getChangePasswordToken());
    }

    // Generate JWT token
    ArrayList<String> roles = new ArrayList<>();
    roles.add(result.getRoleCode());

    Map<String, Object> attributes = new HashMap<>();

    Authentication userDetails = new ServerAuthentication(request.getUsername(), roles, attributes);

    Optional<AccessRefreshToken> tokenOptional = tokenGenerator.generate(userDetails);

    if (tokenOptional.isPresent()) {
      AccessRefreshToken token = tokenOptional.get();

      // Create session
      CreateUserSessionParams sessionParams = new CreateUserSessionParams()
          .setAccessToken(token.getAccessToken())
          .setRefreshToken(token.getRefreshToken())
          .setUserIdentifier(request.getUsername());

      repository.createUserSession(sessionParams);

      return new LoginResponse()
          .setAccessToken(token.getAccessToken())
          .setRefreshToken(token.getRefreshToken());
    }
    else {
      throw new AKException(CommonError.LOGIN_ERROR);
    }
  }

  @Override
  public LogoutResponse logout(LogoutRequest request) throws AKException {

    String authorizationHeader = request.getAuthorizationHeader();
    authorizationHeader = authorizationHeader.replaceFirst("Bearer ", "");

    LogoutParams params = new LogoutParams()
        .setAccessToken(authorizationHeader);

    repository.logoutUserSession(params);

    return new LogoutResponse();
  }

  @Override
  public RefreshAuthTokenResponse refreshAuthToken(RefreshAuthTokenRequest request) throws AKException {

    String refreshToken = request.getAuthorizationHeader().replaceFirst("Bearer ", "");

    Optional<String> validRefreshToken = refreshTokenValidator.validate(refreshToken);
    if (validRefreshToken.isEmpty()) {
      // Signature of refresh token is not valid
      throw new AKUnauthorizedException(UnauthorizedError.REFRESH_TOKEN_ERROR);
    }

    GetUserWithRefreshTokenParams params = new GetUserWithRefreshTokenParams()
        .setRefreshToken(refreshToken);

    GetUserWithRefreshTokenResult userData = repository.getUserWithRefreshToken(params);

    ArrayList<String> roles = new ArrayList<>();
    roles.add(userData.getRoleCodes());

    Authentication auth = new ServerAuthentication(userData.getUserName(), roles, null);

    Optional<AccessRefreshToken> tokenOptional = tokenGenerator.generate(auth);

    if (tokenOptional.isPresent()) {
      AccessRefreshToken token = tokenOptional.get();

      RefreshSessionParams refreshSessionParams = new RefreshSessionParams()
          .setOldRefreshToken(refreshToken)
          .setSessionId(userData.getSessionId())
          .setUserId(userData.getUserId())
          .setNewAuthToken(token.getAccessToken())
          .setNewRefreshToken(token.getRefreshToken());

      repository.refreshSession(refreshSessionParams);

      return new RefreshAuthTokenResponse()
          .setAccessToken(token.getAccessToken())
          .setRefreshToken(token.getRefreshToken());
    }
    else {
      throw new AKException(CommonError.REFRESH_TOKEN_ERROR);
    }
  }
}

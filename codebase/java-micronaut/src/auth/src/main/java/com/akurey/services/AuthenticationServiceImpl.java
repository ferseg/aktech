package com.akurey.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginResult;

import javax.security.auth.login.LoginException;

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
  public LoginResponse login(final LoginRequest request) throws AKException {

    // Login
    final LoginResult result = repository.login(request.getUsername(), request.getPassword());

    // NOTE: Is this really necesary? Since we are restricting to 2 roles
    // also we should not retrict how many rolas a user can have (getRoleCode) seems to be just 1 role
    if (!result.getRoleCode().contentEquals(UserRole.ROLE_USER.getCode()) &&
        !result.getRoleCode().contentEquals(UserRole.ROLE_ADMIN.getCode())) {
      throw new AKUnauthorizedException(UnauthorizedError.LOGIN_USER_ERROR);
    }

    if (result.getChangePasswordToken() != null) {
      throw new AKResetPasswordException(UnauthenticatedError.PASSWORD_RESET_ERROR, result.getChangePasswordToken());
    }

    // Generate JWT token
    final List<String> roles = List.of(result.getRoleCode());

    final Map<String, Object> attributes = new HashMap<>();

    final Authentication userDetails = new ServerAuthentication(request.getUsername(), roles, attributes);

    final Optional<AccessRefreshToken> tokenOptional = tokenGenerator.generate(userDetails);

    if (tokenOptional.isEmpty()) {
      throw new AKUnauthorizedException();
    }
    final AccessRefreshToken token = tokenOptional.get();

    // Create session
    repository.createUserSession(request.getUsername(), token.getAccessToken(), token.getRefreshToken());

    return LoginResponse.builder()
        .accessToken(token.getAccessToken())
        .refreshToken(token.getRefreshToken())
        .build();
  }

  @Override
  public LogoutResponse logout(final LogoutRequest request) throws AKException {

    final String accessToken = request.getAuthorizationHeader().replaceFirst("Bearer ", "");

    repository.logoutUserSession(accessToken);

    return new LogoutResponse();
  }

  @Override
  public RefreshAuthTokenResponse refreshAuthToken(final RefreshAuthTokenRequest request) throws AKException {

    final String refreshToken = request.getAuthorizationHeader().replaceFirst("Bearer ", "");

    final Optional<String> validRefreshToken = refreshTokenValidator.validate(refreshToken);
    if (validRefreshToken.isEmpty()) {
      // Signature of refresh token is not valid
      throw new AKUnauthorizedException(UnauthorizedError.REFRESH_TOKEN_ERROR);
    }

    final GetUserWithRefreshTokenResult userData = repository.getUserWithRefreshToken(refreshToken);

    final List<String> roles = List.of(userData.getRoleCodes());

    final Authentication auth = new ServerAuthentication(userData.getUserName(), roles, null);

    final Optional<AccessRefreshToken> tokenOptional = tokenGenerator.generate(auth);

    if (tokenOptional.isEmpty()) {
      throw new AKUnauthorizedException(UnauthorizedError.REFRESH_TOKEN_ERROR);  
    }
    final AccessRefreshToken token = tokenOptional.get();

    repository.refreshSession(refreshToken, userData.getSessionId(), userData.getUserId(), token.getAccessToken(),
        token.getRefreshToken());

    return RefreshAuthTokenResponse.builder()
        .accessToken(token.getAccessToken())
        .refreshToken(token.getRefreshToken())
        .build();
  }
}

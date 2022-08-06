package com.akurey.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.akurey.common.exceptions.HEException;
import com.akurey.common.exceptions.HEResetPasswordException;
import com.akurey.common.exceptions.HEUnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;
import com.akurey.common.exceptions.errors.UnauthenticatedError;
import com.akurey.common.exceptions.errors.UnauthorizedError;
import com.akurey.common.user.models.UserRole;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.repositories.AuthenticationRepository;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;

import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.authentication.ServerAuthentication;
import io.micronaut.security.token.jwt.generator.AccessRefreshTokenGenerator;
import io.micronaut.security.token.jwt.render.AccessRefreshToken;
import jakarta.inject.Inject;

public class AuthenticationServiceImpl implements AuthenticationService {

  @Inject private AccessRefreshTokenGenerator tokenGenerator;
  @Inject private AuthenticationRepository repository;

  @Override
  public LoginResponse login(LoginRequest request) throws HEException {

    // Login
    LoginParams params = new LoginParams()
        .setUserIdentifier(request.getUsername())
        .setPassword(request.getPassword());

    LoginResult result = repository.login(params);

    if (!result.getRoleCode().contentEquals(UserRole.ROLE_USER.getCode())) {
      throw new HEUnauthorizedException(UnauthorizedError.LOGIN_USER_ERROR);
    }

    if (result.getChangePasswordToken() != null) {
      throw new HEResetPasswordException(UnauthenticatedError.PASSWORD_RESET_ERROR, result.getChangePasswordToken());
    }

    // Generate JWT token
    ArrayList<String> roles = new ArrayList<>();
    roles.add(result.getRoleCode());

    Map<String, Object> attributes = new HashMap<String, Object>();

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
      throw new HEException(CommonError.LOGIN_ERROR);
    }
  }
}

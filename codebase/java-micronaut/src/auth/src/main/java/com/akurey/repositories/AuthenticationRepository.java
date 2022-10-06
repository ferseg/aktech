package com.akurey.repositories;

import com.akurey.common.exceptions.AKException;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginResult;

public interface AuthenticationRepository {

  LoginResult login(String userIdentifier, String password) throws AKException;

  void createUserSession(String userIdentifier, String accessToken, String refreshToken) throws AKException;

  void logoutUserSession(String accessToken) throws AKException;

  GetUserWithRefreshTokenResult getUserWithRefreshToken(String refreshToken) throws AKException;

  void refreshSession(String oldRefreshToken, Long sessionId, Long userId, String newRefreshToken, String newAuthToken)
      throws AKException;
}

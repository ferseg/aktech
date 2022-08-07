package com.akurey.repositories;

import com.akurey.common.exceptions.HEException;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;
import com.akurey.repositories.entities.LogoutParams;
import com.akurey.repositories.entities.RefreshSessionParams;

public interface AuthenticationRepository {

  LoginResult login(LoginParams params) throws HEException;

  void createUserSession(CreateUserSessionParams params) throws HEException;

  void logoutUserSession(LogoutParams params) throws HEException;

  GetUserWithRefreshTokenResult getUserWithRefreshToken(GetUserWithRefreshTokenParams params) throws HEException;

  void refreshSession(RefreshSessionParams params) throws HEException;
}

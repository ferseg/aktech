package com.akurey.repositories;

import com.akurey.common.exceptions.AKException;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;
import com.akurey.repositories.entities.LogoutParams;
import com.akurey.repositories.entities.RefreshSessionParams;

public interface AuthenticationRepository {

  LoginResult login(LoginParams params) throws AKException;

  void createUserSession(CreateUserSessionParams params) throws AKException;

  void logoutUserSession(LogoutParams params) throws AKException;

  GetUserWithRefreshTokenResult getUserWithRefreshToken(GetUserWithRefreshTokenParams params) throws AKException;

  void refreshSession(RefreshSessionParams params) throws AKException;
}

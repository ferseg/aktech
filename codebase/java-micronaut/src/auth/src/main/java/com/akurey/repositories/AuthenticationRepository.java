package com.akurey.repositories;

import com.akurey.common.exceptions.CustomException;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;
import com.akurey.repositories.entities.LogoutParams;
import com.akurey.repositories.entities.RefreshSessionParams;

public interface AuthenticationRepository {

  LoginResult login(LoginParams params) throws CustomException;

  void createUserSession(CreateUserSessionParams params) throws CustomException;

  void logoutUserSession(LogoutParams params) throws CustomException;

  GetUserWithRefreshTokenResult getUserWithRefreshToken(GetUserWithRefreshTokenParams params) throws CustomException;

  void refreshSession(RefreshSessionParams params) throws CustomException;
}

package com.akurey.repositories;

import com.akurey.common.exceptions.HEException;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;

public interface AuthenticationRepository {

  LoginResult login(LoginParams params) throws HEException;

  void createUserSession(CreateUserSessionParams params) throws HEException;
}

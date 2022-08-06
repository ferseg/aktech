package com.akurey.services;

import com.akurey.common.exceptions.HEException;
import com.akurey.models.LoginRequest;
import com.akurey.models.LoginResponse;
import com.akurey.repositories.entities.CreateUserSessionParams;

public interface AuthenticationService {

  LoginResponse login(LoginRequest request) throws HEException;
}

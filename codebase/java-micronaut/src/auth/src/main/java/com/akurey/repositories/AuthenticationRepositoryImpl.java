package com.akurey.repositories;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import com.akurey.common.exceptions.CustomException;
import com.akurey.common.repositories.BaseRepository;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenParams;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;
import com.akurey.repositories.entities.LogoutParams;
import com.akurey.repositories.entities.RefreshSessionParams;

import jakarta.inject.Singleton;

@Singleton
public class AuthenticationRepositoryImpl extends BaseRepository implements AuthenticationRepository {

  private final EntityManager entityManager;

  public AuthenticationRepositoryImpl(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Override
  protected EntityManager getEntityManager() {
    return entityManager;
  }

  @Override
  @Transactional
  public LoginResult login(LoginParams params) throws CustomException {
    return getSingleResult(params, LoginResult.class);
  }

  @Override
  @Transactional
  public void createUserSession(CreateUserSessionParams params) throws CustomException {
    executeWithoutResult(params);
  }

  @Override
  @Transactional
  public void logoutUserSession(LogoutParams params) throws CustomException {
    executeWithoutResult(params);
  }

  @Override
  @Transactional
  public GetUserWithRefreshTokenResult getUserWithRefreshToken(GetUserWithRefreshTokenParams params)
      throws CustomException {
    return getSingleResult(params, GetUserWithRefreshTokenResult.class);
  }

  @Override
  @Transactional
  public void refreshSession(RefreshSessionParams params) throws CustomException {
    executeWithoutResult(params);
  }
}

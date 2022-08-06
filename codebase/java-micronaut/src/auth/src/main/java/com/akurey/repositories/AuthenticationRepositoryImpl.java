package com.akurey.repositories;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import com.akurey.common.exceptions.HEException;
import com.akurey.common.repositories.BaseRepository;
import com.akurey.repositories.entities.CreateUserSessionParams;
import com.akurey.repositories.entities.LoginParams;
import com.akurey.repositories.entities.LoginResult;

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
  public LoginResult login(LoginParams params) throws HEException {
    return getSingleResult(params, LoginResult.class);
  }

  @Override
  @Transactional
  public void createUserSession(CreateUserSessionParams params) throws HEException {
    executeWithoutResult(params);
  }
}

package com.akurey.repositories;

import java.util.List;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.repositories.BaseRepository;
import com.akurey.common.repositories.SPParam;
import com.akurey.repositories.entities.GetUserWithRefreshTokenResult;
import com.akurey.repositories.entities.LoginResult;
import com.google.common.collect.ImmutableList;

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

  // NOTE: Move literals to constants
  @Override
  @Transactional
  public LoginResult login(String userIdentifier, String password) throws AKException {

    List<SPParam> params = ImmutableList.of(
        SPParam.builder().paramName("pUserIdentifier").value(userIdentifier).build(),
        SPParam.builder().paramName("pPassword").value(password).build()
    );

    return getSingleResult("CoreSPLoginUser", params, LoginResult.class);
  }

  @Override
  @Transactional
  public void createUserSession(String userIdentifier, String accessToken, String refreshToken) throws AKException {

    List<SPParam> params = ImmutableList.of(
        SPParam.builder().paramName("pUserIdentifier").value(userIdentifier).build(),
        SPParam.builder().paramName("pAccessToken").value(accessToken).build(),
        SPParam.builder().paramName("pRefreshToken").value(refreshToken).build()
    );

    executeWithoutResult("CoreSPCreateUserSession", params);
  }

  @Override
  @Transactional
  public void logoutUserSession(String accessToken) throws AKException {

    List<SPParam> params = ImmutableList.of(
        SPParam.builder().paramName("pAccessToken").value(accessToken).build()
    );

    executeWithoutResult("CoreSPLogoutUser", params);
  }

  @Override
  @Transactional
  public GetUserWithRefreshTokenResult getUserWithRefreshToken(String refreshToken) throws AKException {

    List<SPParam> params = ImmutableList.of(
        SPParam.builder().paramName("pRefreshToken").value(refreshToken).build()
    );

    return getSingleResult("CoreSPGetUserWithRefreshToken", params, GetUserWithRefreshTokenResult.class);
  }

  @Override
  @Transactional
  public void refreshSession(String oldRefreshToken, Long sessionId, Long userId, String newRefreshToken,
      String newAuthToken) throws AKException {

    List<SPParam> params = ImmutableList.of(
        SPParam.builder().paramName("pOldRefreshToken").value(oldRefreshToken).build(),
        SPParam.builder().paramName("pSessionId").value(sessionId.toString()).build(),
        SPParam.builder().paramName("pUserId").value(userId.toString()).build(),
        SPParam.builder().paramName("pNewRefreshToken").value(newRefreshToken).build(),
        SPParam.builder().paramName("pNewAuthToken").value(newAuthToken).build()
    );

    executeWithoutResult("CoreSPRefreshSession", params);
  }
}

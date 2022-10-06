package com.akurey.services.security;

import org.reactivestreams.Publisher;

import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.token.event.RefreshTokenGeneratedEvent;
import io.micronaut.security.token.refresh.RefreshTokenPersistence;
import jakarta.inject.Singleton;

/**
 *
 * The Micronaut class DefaultAccessRefreshTokenGenerator depends on the
 * presence of one implementation of RefreshTokenPersistence in order to include
 * a refresh token as part of the token response.
 *
 * It is intended to persist the token, but not real implementation is included
 * since this is handled in our own service
 *
 */
@Singleton
public class RefreshTokenPersistenceImpl implements RefreshTokenPersistence {

  @Override
  public void persistToken(RefreshTokenGeneratedEvent event) {
    // TODO Auto-generated method stub
  }

  @Override
  public Publisher<Authentication> getAuthentication(String refreshToken) {
    // TODO Auto-generated method stub
    return null;
  }

}

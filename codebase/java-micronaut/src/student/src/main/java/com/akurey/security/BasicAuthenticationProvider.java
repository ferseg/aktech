package com.akurey.security;

import org.reactivestreams.Publisher;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.HttpRequest;
import io.micronaut.security.authentication.AuthenticationProvider;
import io.micronaut.security.authentication.AuthenticationRequest;
import io.micronaut.security.authentication.AuthenticationResponse;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

@Singleton
@RequiredArgsConstructor
public class BasicAuthenticationProvider implements AuthenticationProvider {

    // TODO: Implement actual logic to authorize an User
    @Override
    public Publisher<AuthenticationResponse> authenticate(@Nullable final HttpRequest<?> httpRequest,
                                                          final AuthenticationRequest<?, ?> authenticationRequest) {
        return Flux.create(emitter -> {
            final String username = (String) authenticationRequest.getIdentity();
            final String password = (String) authenticationRequest.getSecret();

            try {
                final Map<String, Object> attributes = new HashMap<>();
                emitter.next(AuthenticationResponse.success(username, List.of("Admin"), attributes));
                emitter.complete();
            } catch (final RuntimeException ice) {
                emitter.next(AuthenticationResponse.failure(ice.getMessage()));
                emitter.error(AuthenticationResponse.exception());
            }
        }, FluxSink.OverflowStrategy.ERROR);
    }

}

package com.akurey.common.annotations;

import java.util.Arrays;
import java.util.List;

import com.akurey.common.models.BaseRequest;
import com.akurey.common.models.UserAuth;

import io.micronaut.aop.InterceptorBean;
import io.micronaut.aop.MethodInterceptor;
import io.micronaut.aop.MethodInvocationContext;
import io.micronaut.security.utils.SecurityService;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

@Singleton
@InterceptorBean(InjectAuthUser.class)
@RequiredArgsConstructor
public class InjectAuthUserInterceptor implements MethodInterceptor<Object, Object> {

    private final SecurityService securityService;

    @Override
    public Object intercept(final MethodInvocationContext<Object, Object> context) {
        securityService.getAuthentication().ifPresent( auth -> {
                final BaseRequest baseRequest = (BaseRequest) Arrays.stream(context.getParameterValues())
                    .filter(param -> param instanceof BaseRequest)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Expecting a base request argument"));
                final UserAuth userAuth = UserAuth.builder()
                    .userIdentifier(auth.getName())
                    .roles(List.copyOf(auth.getRoles()))
                    .build();
                baseRequest.setUser(userAuth);
            }
        );
        
        return context.proceed();
    }
    
}

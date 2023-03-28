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
        securityService.getAuthentication().ifPresent( au -> {
                final BaseRequest baseRequest = (BaseRequest) Arrays.stream(context.getParameterValues())
                    .filter(param -> param instanceof BaseRequest)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Expecting a base request argument"));
                final UserAuth ua = UserAuth.builder()
                    .userIdentifier(au.getName())
                    .roles(List.copyOf(au.getRoles()))
                    .build();
                baseRequest.setUser(ua);
            }
        );
        
        return context.proceed();
    }
    
}

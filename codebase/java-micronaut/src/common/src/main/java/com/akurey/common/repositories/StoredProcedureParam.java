package com.akurey.common.repositories;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.persistence.ParameterMode;

import jakarta.inject.Qualifier;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Qualifier
public @interface StoredProcedureParam {

  String name();

  ParameterMode mode() default ParameterMode.IN;
}

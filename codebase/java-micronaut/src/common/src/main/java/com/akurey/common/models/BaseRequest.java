package com.akurey.common.models;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.core.annotation.Nullable;
import lombok.Data;

@Data
@Introspected
public abstract class BaseRequest {

  @Nullable
  private UserAuth user;
}

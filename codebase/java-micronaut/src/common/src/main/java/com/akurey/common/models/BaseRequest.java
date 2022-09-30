package com.akurey.common.models;

import io.micronaut.core.annotation.Nullable;
import lombok.Data;

@Data
public abstract class BaseRequest {

  @Nullable
  private UserAuth user;
}

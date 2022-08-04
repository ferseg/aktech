package com.akurey.common.models;

import io.micronaut.core.annotation.Nullable;

public abstract class BaseRequest {

  @Nullable
  private UserAuth user;

  public UserAuth getUser() {
    return user;
  }

  public void setUser(UserAuth user) {
    this.user = user;
  }

}

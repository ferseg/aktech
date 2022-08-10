package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;

@Introspected
public class HelloWorldRequest extends BaseRequest {

  private String name;

  public String getName() {
    return name;
  }

  public HelloWorldRequest setName(String name) {
    this.name = name;
    return this;
  }
}

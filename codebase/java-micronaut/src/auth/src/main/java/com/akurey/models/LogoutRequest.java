package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.annotation.Header;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Introspected
public class LogoutRequest extends BaseRequest {

  @Header("Authorization")
  private String authorizationHeader;
}

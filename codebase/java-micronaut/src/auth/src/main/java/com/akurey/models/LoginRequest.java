package com.akurey.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Introspected
public class LoginRequest extends BaseRequest {

  @NotBlank
  @Size(min = 1, max = 50)
  private String username;

  @NotBlank
  @Size(min = 1, max = 255)
  private String password;
}

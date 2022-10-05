package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.http.annotation.PathVariable;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Introspected
public class StudentRequest extends BaseRequest {

  @Nullable
  private Long id;

  private String firstName;

  @Nullable
  private String middleName;

  private String lastName;

  private String email;
}

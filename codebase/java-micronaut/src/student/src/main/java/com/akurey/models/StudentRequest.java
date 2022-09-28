package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Nullable;
import lombok.Data;

@Data
public class StudentRequest extends BaseRequest {

  private String firstName;
  @Nullable
  private String middleName;
  private String lastName;
  private String email;
}

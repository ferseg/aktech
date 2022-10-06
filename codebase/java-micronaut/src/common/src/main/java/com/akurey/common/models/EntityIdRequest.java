package com.akurey.common.models;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.annotation.PathVariable;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@Introspected
public class EntityIdRequest extends BaseRequest {

  @PathVariable
  private Long id;
}

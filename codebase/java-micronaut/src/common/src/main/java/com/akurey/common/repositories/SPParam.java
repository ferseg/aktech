package com.akurey.common.repositories;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SPParam {

  private String paramName;

  private String value;
}

package com.akurey.common.models;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserAuth {

  private String userIdentifier;

  private List<String> roles;
}

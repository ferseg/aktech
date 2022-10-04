package com.akurey.repositories.entities;

import com.akurey.common.repositories.BaseSPParams;
import com.akurey.common.repositories.StoredProcedureParam;
import com.akurey.common.repositories.StoredProcedureParams;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@StoredProcedureParams(storeProcedureName = "CoreSPCreateUserSession")
public class CreateUserSessionParams extends BaseSPParams {

  @StoredProcedureParam(name = "pUserIdentifier")
  private String userIdentifier;

  @StoredProcedureParam(name = "pAccessToken")
  private String accessToken;

  @StoredProcedureParam(name = "pRefreshToken")
  private String refreshToken;
}

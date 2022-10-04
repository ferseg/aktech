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
@StoredProcedureParams(storeProcedureName = "CoreSPLogoutUser")
public class LogoutParams extends BaseSPParams {

  @StoredProcedureParam(name = "pAccessToken")
  private String accessToken;
}

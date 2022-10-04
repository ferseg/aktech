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
@StoredProcedureParams(storeProcedureName = "CoreSPLoginUser")
public class LoginParams extends BaseSPParams {

  @StoredProcedureParam(name = "pUserIdentifier")
  private String userIdentifier;

  @StoredProcedureParam(name = "pPassword")
  private String password;
}

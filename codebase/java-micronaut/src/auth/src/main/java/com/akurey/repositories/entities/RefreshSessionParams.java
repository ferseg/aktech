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
@StoredProcedureParams(storeProcedureName = "CoreSPRefreshSession")
public class RefreshSessionParams extends BaseSPParams {

  @StoredProcedureParam(name = "pOldRefreshToken")
  private String oldRefreshToken;

  @StoredProcedureParam(name = "pSessionId")
  private Long sessionId;

  @StoredProcedureParam(name = "pUserId")
  private Long userId;

  @StoredProcedureParam(name = "pNewRefreshToken")
  private String newRefreshToken;

  @StoredProcedureParam(name = "pNewAuthToken")
  private String newAuthToken;
}

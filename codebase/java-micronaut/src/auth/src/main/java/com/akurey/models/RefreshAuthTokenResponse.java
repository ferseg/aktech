package com.akurey.models;

import com.akurey.common.models.BaseResponse;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
public class RefreshAuthTokenResponse extends BaseResponse {

  private String accessToken;

  private String refreshToken;
}

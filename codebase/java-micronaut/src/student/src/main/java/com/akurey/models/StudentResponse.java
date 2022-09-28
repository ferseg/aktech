package com.akurey.models;

import java.time.LocalDateTime;

import com.akurey.common.models.BaseResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class StudentResponse extends BaseResponse {

  private Long studentId;
  private String firstName;
  @JsonInclude
  private String middleName;
  private String lastName;
  private String email;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime created;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime updated;
}

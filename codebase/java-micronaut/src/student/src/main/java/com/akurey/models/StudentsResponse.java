package com.akurey.models;

import java.util.List;

import com.akurey.common.models.BaseResponse;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
public class StudentsResponse extends BaseResponse {

  private List<StudentResponse> students;
}

package com.akurey.models;

import java.util.List;

import com.akurey.common.models.BaseResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentsResponse extends BaseResponse {

  private List<StudentResponse> students;
}

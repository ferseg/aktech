package com.akurey.repositories.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.akurey.common.repositories.BaseSPResult;

import lombok.Data;

@Entity
@Data
public class TestResult extends BaseSPResult {

  @Id
  private Integer id;
}

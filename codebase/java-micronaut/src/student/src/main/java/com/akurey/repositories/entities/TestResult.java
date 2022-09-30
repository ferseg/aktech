package com.akurey.repositories.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.akurey.common.repositories.BaseSPResult;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class TestResult extends BaseSPResult {

  @Id
  private Integer id;
}

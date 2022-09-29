package com.akurey.repositories;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.repositories.BaseRepository;
import com.akurey.repositories.entities.Student;
import com.akurey.repositories.entities.TestParams;
import com.akurey.repositories.entities.TestResult;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public abstract class StudentRepository extends BaseRepository implements CrudRepository<Student, Long> {

  private final EntityManager entityManager;

  public StudentRepository(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Override
  protected EntityManager getEntityManager() {
    return entityManager;
  }

  @Transactional
  public TestResult test(TestParams params) throws AKException {
    return getSingleResult(params, TestResult.class);
  }
}

package com.akurey.repositories;

import java.util.List;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.repositories.BaseRepository;
import com.akurey.common.repositories.SPParam;
import com.akurey.repositories.entities.EntityResult;
import com.akurey.repositories.entities.Student;
import com.google.common.collect.ImmutableList;

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
  public EntityResult test(Integer entityCount, String description) throws AKException {

    List<SPParam> params = ImmutableList.of(
        SPParam.builder().paramName("pEntityCount").value(entityCount.toString()).build(),
        SPParam.builder().paramName("pDescription").value(description).build()
    );

    return getSingleResult("CoreSPTestAddEntityCount", params, EntityResult.class);
  }
}

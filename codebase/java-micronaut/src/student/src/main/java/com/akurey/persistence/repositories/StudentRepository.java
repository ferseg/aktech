package com.akurey.persistence.repositories;

import javax.persistence.EntityManager;
import com.akurey.common.repositories.BaseRepository;
import com.akurey.persistence.entities.Student;

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

}

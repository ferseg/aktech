package com.akurey.common.repositories;

import java.sql.SQLException;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceException;
import javax.persistence.StoredProcedureQuery;

import org.hibernate.JDBCException;

import com.akurey.common.exceptions.*;
import com.akurey.common.exceptions.errors.CommonError;

public abstract class BaseRepository {

  protected abstract EntityManager getEntityManager();

  protected void executeWithoutResult(String spName, List<SPParam> params) throws AKException {
    EntityManager entityManager = getEntityManager();
    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, spName, params, null);

      storedProcedure.execute();

    } catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  @SuppressWarnings("unchecked")
  protected <TResult extends BaseSPResult> TResult getSingleResult(String spName, List<SPParam> params,
      Class<TResult> resultClass)
      throws AKException {

    EntityManager entityManager = getEntityManager();

    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, spName, params, resultClass);

      storedProcedure.execute();

      return (TResult) storedProcedure.getSingleResult();
    } catch (NoResultException e) {
      throw new AKNotFoundException(e);
    } catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  @SuppressWarnings("unchecked")
  protected <TResult extends BaseSPResult> List<TResult> getResultList(String spName, List<SPParam> params,
      Class<TResult> resultClass)
      throws AKException {

    EntityManager entityManager = getEntityManager();
    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, spName, params, resultClass);

      storedProcedure.execute();

      return storedProcedure.getResultList();
    } catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  private StoredProcedureQuery buildStoredProcedure(EntityManager entityManager, String spName, List<SPParam> params,
      Class<? extends BaseSPResult> resultClass) throws AKException {

    if (!isStoredProcedure(entityManager, spName)) {
      throw new AKDatabaseException(CommonError.DB_EXECUTION_ERROR);
    }

    StoredProcedureQuery storedProcedure = createStoredProcedureQuery(entityManager, spName, resultClass);

    registerStoredProcedureParameters(params, storedProcedure);

    return storedProcedure;
  }

  private boolean isStoredProcedure(EntityManager entityManager, String spName) {
    return entityManager != null && spName != null;
  }

  private StoredProcedureQuery createStoredProcedureQuery(EntityManager entityManager, String spName,
      Class<?> resultClass) {
    if (resultClass == null) {
      return entityManager.createStoredProcedureQuery(spName);
    }
    return entityManager.createStoredProcedureQuery(spName, resultClass);
  }

  private void registerStoredProcedureParameters(List<SPParam> params, StoredProcedureQuery storedProcedure) {
    for (SPParam param : params) {
      storedProcedure.registerStoredProcedureParameter(param.getParamName(), String.class, ParameterMode.IN);
      storedProcedure.setParameter(param.getParamName(), param.getValue());
    }
  }

  private AKException createHEDBException(PersistenceException e) {
    String returnMessage = null;
    int errorCode = 0;

    if (e.getCause() instanceof JDBCException) {
      JDBCException cause = (JDBCException) e.getCause();
      try {
        SQLException sqlException = cause.getSQLException();
        errorCode = sqlException.getErrorCode();
        if ((errorCode >= 50000) && (errorCode <= 59999)) {
          returnMessage = sqlException.getMessage();
        }
      } catch (Exception ex) {
        returnMessage = null;
      }
    }

    if (returnMessage == null) {
      return new AKDatabaseException(CommonError.DB_EXECUTION_ERROR, e);
    }

    if (errorCode < 50000 || errorCode >= 54000) {
      return new AKDatabaseException(returnMessage, e, errorCode);
    }

    if (errorCode < 51000) {
      return new AKBadRequestException(returnMessage, e, errorCode);
    }
    if (errorCode < 52000) {
      return new AKUnauthenticatedException(returnMessage, e, errorCode);
    }
    if (errorCode < 53000) {
      return new AKDatabaseException(returnMessage, e, errorCode);
    }
    return new AKUnauthorizedException(returnMessage, e, errorCode);
  }

}

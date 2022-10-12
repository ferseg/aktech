package com.akurey.common.repositories;

import java.sql.SQLException;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceException;
import javax.persistence.StoredProcedureQuery;

import org.hibernate.JDBCException;

import com.akurey.common.exceptions.AKBadRequestException;
import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.AKNotFoundException;
import com.akurey.common.exceptions.AKUnauthenticatedException;
import com.akurey.common.exceptions.AKUnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;

public abstract class BaseRepository {

  protected abstract EntityManager getEntityManager();

  protected void executeWithoutResult(String spName, List<SPParam> params) throws AKException {
    EntityManager entityManager = getEntityManager();
    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, spName, params, null);

      storedProcedure.execute();

    }
    catch (PersistenceException e) {
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
    }
    catch (NoResultException e) {
      throw new AKNotFoundException(e);
    }
    catch (PersistenceException e) {
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
    }
    catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  private StoredProcedureQuery buildStoredProcedure(EntityManager entityManager, String spName, List<SPParam> params,
      Class<? extends BaseSPResult> resultClass) throws AKException {

    if (!isStoredProcedure(entityManager, spName)) {
      throw new AKException(CommonError.DB_EXECUTION_ERROR);
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
    StoredProcedureQuery storedProcedure;
    if (resultClass != null) {
      storedProcedure = entityManager.createStoredProcedureQuery(spName, resultClass);
    }
    else {
      storedProcedure = entityManager.createStoredProcedureQuery(spName);
    }
    return storedProcedure;
  }

  private void registerStoredProcedureParameters(List<SPParam> params, StoredProcedureQuery storedProcedure) {
    for (SPParam param : params) {
      storedProcedure.registerStoredProcedureParameter(param.getParamName(), String.class, ParameterMode.IN);
      storedProcedure.setParameter(param.getParamName(), param.getValue());
    }
  }

  private AKException createHEDBException(PersistenceException e) {
    AKException exception;
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
      }
      catch (Exception ex) {
        returnMessage = null;
      }
    }

    if (returnMessage != null) {
      if ((errorCode >= 50000) && (errorCode <= 50999)) {
        exception = new AKBadRequestException(returnMessage, e, errorCode);
      }
      else if ((errorCode >= 51000) && (errorCode <= 51999)) {
        exception = new AKUnauthenticatedException(returnMessage, e, errorCode);
      }
      else if ((errorCode >= 53000) && (errorCode <= 53999)) {
        exception = new AKUnauthorizedException(returnMessage, e, errorCode);
      }
      else {
        exception = new AKException(returnMessage, e, errorCode);
      }
    }
    else {
      exception = new AKException(CommonError.DB_EXECUTION_ERROR, e);
    }

    return exception;
  }

}

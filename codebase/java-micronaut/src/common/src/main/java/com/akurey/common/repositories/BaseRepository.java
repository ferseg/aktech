package com.akurey.common.repositories;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.ParameterMode;
import javax.persistence.PersistenceException;
import javax.persistence.StoredProcedureQuery;

import org.hibernate.JDBCException;

import com.akurey.common.exceptions.HEBadRequestException;
import com.akurey.common.exceptions.HEException;
import com.akurey.common.exceptions.HENotFoundException;
import com.akurey.common.exceptions.HEUnauthenticatedException;
import com.akurey.common.exceptions.HEUnauthorizedException;
import com.akurey.common.exceptions.errors.CommonError;

public abstract class BaseRepository {

  protected abstract EntityManager getEntityManager();

  protected void executeWithoutResult(BaseSPParams params) throws HEException {
    EntityManager entityManager = getEntityManager();
    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, params, null);

      storedProcedure.execute();

    }
    catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  @SuppressWarnings("unchecked")
  protected <TResult extends BaseSPResult> TResult getSingleResult(BaseSPParams params, Class<TResult> resultClass)
      throws HEException {

    EntityManager entityManager = getEntityManager();

    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, params, resultClass);

      storedProcedure.execute();

      return (TResult) storedProcedure.getSingleResult();
    }
    catch (NoResultException e) {
      throw new HENotFoundException(e);
    }
    catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  @SuppressWarnings("unchecked")
  protected <TResult extends BaseSPResult> List<TResult> getResultList(BaseSPParams params, Class<TResult> resultClass)
      throws HEException {

    EntityManager entityManager = getEntityManager();
    try {
      StoredProcedureQuery storedProcedure = buildStoredProcedure(entityManager, params, resultClass);

      storedProcedure.execute();

      return storedProcedure.getResultList();
    }
    catch (PersistenceException e) {
      throw createHEDBException(e);
    }
  }

  private StoredProcedureQuery buildStoredProcedure(EntityManager entityManager, BaseSPParams params,
      Class<? extends BaseSPResult> resultClass) throws HEException {

    if (isStoredProcedure(entityManager, params)) {
      throw new HEException(CommonError.DB_EXECUTION_ERROR);
    }

    Class<?> paramsClass = params.getClass();
    StoredProcedureQuery storedProcedure = createStoredProcedureQuery(entityManager, paramsClass, resultClass);

    registerStoredProcedureParameters(params, paramsClass, storedProcedure);

    return storedProcedure;
  }

  private boolean isStoredProcedure(EntityManager entityManager, BaseSPParams params) {
    return (entityManager == null) || (params == null)
        || !params.getClass().isAnnotationPresent(StoredProcedureParams.class);
  }

  private StoredProcedureQuery createStoredProcedureQuery(EntityManager entityManager, Class<?> paramsClass,
      Class<?> resultClass) {
    StoredProcedureParams spParams = paramsClass.getAnnotation(StoredProcedureParams.class);
    StoredProcedureQuery storedProcedure;
    if (resultClass != null) {
      storedProcedure = entityManager.createStoredProcedureQuery(spParams.storeProcedureName(), resultClass);
    }
    else {
      storedProcedure = entityManager.createStoredProcedureQuery(spParams.storeProcedureName());
    }
    return storedProcedure;
  }

  private void registerStoredProcedureParameters(BaseSPParams params, Class<?> paramsClass,
      StoredProcedureQuery storedProcedure) throws HEException {
    for (Field field : paramsClass.getDeclaredFields()) {
      if (field.isAnnotationPresent(StoredProcedureParam.class)) {
        StoredProcedureParam param = field.getAnnotation(StoredProcedureParam.class);
        storedProcedure.registerStoredProcedureParameter(param.name(), field.getType(), param.mode());

        if (param.mode().equals(ParameterMode.IN) || param.mode().equals(ParameterMode.INOUT)) {
          try {

            String capitalizedName = field.getName().substring(0, 1).toUpperCase() + field.getName().substring(1);
            String getter = "get" + capitalizedName;
            Method method = paramsClass.getDeclaredMethod(getter);

            if ((method != null) && method.canAccess(params)) {
              Object propertyValue = method.invoke(params);
              storedProcedure.setParameter(param.name(), propertyValue);
            }
            else {
              throw new HEException(CommonError.DB_EXECUTION_ERROR);
            }
          }
          catch (Exception e) {
            throw new HEException(CommonError.DB_EXECUTION_ERROR, e);
          }
        }
      }
    }
  }

  private HEException createHEDBException(PersistenceException e) {
    HEException exception;
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
        exception = new HEBadRequestException(returnMessage, e, errorCode);
      }
      else if ((errorCode >= 51000) && (errorCode <= 51999)) {
        exception = new HEUnauthenticatedException(returnMessage, e, errorCode);
      }
      else if ((errorCode >= 53000) && (errorCode <= 53999)) {
        exception = new HEUnauthorizedException(returnMessage, e, errorCode);
      }
      else {
        exception = new HEException(returnMessage, e, errorCode);
      }
    }
    else {
      exception = new HEException(CommonError.DB_EXECUTION_ERROR, e);
    }

    return exception;
  }

}

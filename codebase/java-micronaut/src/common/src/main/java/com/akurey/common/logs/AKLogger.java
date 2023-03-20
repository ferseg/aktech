package com.akurey.common.logs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

import com.akurey.common.exceptions.AKException;
import com.akurey.common.exceptions.errors.CommonError;

import static net.logstash.logback.marker.Markers.append;

// NOTE: Does this have any added value? Since using for example @slf4j will already mark this as an info message
public final class AKLogger {

  private static final String CUSTOM_LOG = "custom_log";

  public static void logInfo(Object caller, String message) {
    Logger logger = LoggerFactory.getLogger(caller.getClass());
    LogMarker marker = new LogMarker();
    LogEvent event = LogEvent.INFORMATION_LOG;
    marker.setEventType(event.getEventType());
    marker.setEventCode(event.getCode());
    marker.setEventMessage(Optional.ofNullable(message).orElse(event.getMessage()));

    logger.info(event.getMessage(), append(CUSTOM_LOG, marker));
  }

  public static void logRequestSuccess(Object caller, Object request) {
    Logger logger = LoggerFactory.getLogger(caller.getClass());
    LogMarker marker = new LogMarker();
    LogEvent event = LogEvent.REQUEST_EXECUTION_OK;
    marker.setRequest(request);
    marker.setEventType(event.getEventType());
    marker.setEventCode(event.getCode());
    marker.setEventMessage(event.getMessage());

    logger.info(event.getMessage(), append(CUSTOM_LOG, marker));
  }

  // NOTE: We could also achieve this by applying AOP so we don't to call it manually maybe
  public static void logRequestFailure(Object caller, AKException exception, Object request) {
    LogEvent event = LogEvent.REQUEST_EXECUTION_FAILED;
    Logger logger = LoggerFactory.getLogger(caller.getClass());
    LogMarker marker = new LogMarker();
    marker.setRequest(request);
    marker.setErrorCode(exception.getErrorCode());
    marker.setErrorMessage(getMessageFromStack(exception));
    marker.setEventType(event.getEventType());
    marker.setEventCode(event.getCode());
    marker.setEventMessage(event.getMessage());

    logger.error(event.getMessage(), append(CUSTOM_LOG, marker));
  }

  public static void logRequestFailure(Object caller, Exception exception, Object request) {
    LogEvent event = LogEvent.REQUEST_EXECUTION_FAILED;
    Logger logger = LoggerFactory.getLogger(caller.getClass());
    LogMarker marker = new LogMarker();
    marker.setRequest(request);
    marker.setErrorCode(CommonError.NOT_HANDLED_ERROR.getCode());
    marker.setErrorMessage(getMessageFromStack(exception));
    marker.setEventType(event.getEventType());
    marker.setEventCode(event.getCode());
    marker.setEventMessage(event.getMessage());

    logger.error(event.getMessage(), append(CUSTOM_LOG, marker));
  }

  private static String getMessageFromStack(Exception exception) {
    StringBuilder errorMessage = new StringBuilder(exception.getMessage());
    int level = 3;
    Throwable e = exception;
    while (level > 0) {
      if (e.getCause() == null) {
        return errorMessage.toString();
      }
      e = e.getCause();
      errorMessage.append(" -- ")
                .append(e.getMessage());
      level--;
    }
    return errorMessage.toString();
  }

}

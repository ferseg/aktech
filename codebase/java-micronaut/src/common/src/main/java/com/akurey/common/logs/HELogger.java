package com.akurey.common.logs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.akurey.common.exceptions.HEException;

import static net.logstash.logback.marker.Markers.append;

public final class HELogger {

  private static final String HE_LOG = "he_log";

  public static void logRequestSuccess(Object caller, Object request) {
    Logger logger = LoggerFactory.getLogger(caller.getClass());
    LogMarker marker = new LogMarker();
    LogEvent event = LogEvent.REQUEST_EXECUTION_OK;
    marker.setRequest(request);
    marker.setEventType(event.getEventType());
    marker.setEventCode(event.getCode());
    marker.setEventMessage(event.getMessage());

    logger.info(event.getMessage(), append(HE_LOG, marker));
  }

  public static void logRequestFailure(Object caller, HEException exception, Object request) {
    LogEvent event = LogEvent.REQUEST_EXECUTION_FAILED;
    Logger logger = LoggerFactory.getLogger(caller.getClass());
    LogMarker marker = new LogMarker();
    marker.setRequest(request);
    marker.setErrorCode(exception.getErrorCode());
    marker.setErrorMessage(getMessageFromStack(exception));
    marker.setEventType(event.getEventType());
    marker.setEventCode(event.getCode());
    marker.setEventMessage(event.getMessage());

    logger.error(event.getMessage(), append(HE_LOG, marker));
  }

  private static String getMessageFromStack(Exception exception) {
    String errorMessage = exception.getMessage();
    int level = 3;
    Throwable e = exception;
    while (level > 0) {
      if (e.getCause() == null) {
        return errorMessage;
      }
      else {
        e = e.getCause();
        errorMessage += " -- " + e.getMessage();
      }
      level--;
    }
    return errorMessage;
  }

}

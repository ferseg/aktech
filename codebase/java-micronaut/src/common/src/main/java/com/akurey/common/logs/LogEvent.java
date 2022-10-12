package com.akurey.common.logs;

public enum LogEvent {

  REQUEST_EXECUTION_OK(10001, "Request execution succeed", LogEventType.ACCESS),
  REQUEST_EXECUTION_FAILED(10002, "Request execution failed", LogEventType.ERROR),
  INFORMATION_LOG(10003, "Information log", LogEventType.INFORMATION);

  private LogEvent(int code, String message, LogEventType eventType) {
    this.code = code;
    this.message = message;
    this.eventType = eventType;
  }

  private int code;
  private String message;
  private LogEventType eventType;

  public int getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public LogEventType getEventType() {
    return eventType;
  }
}

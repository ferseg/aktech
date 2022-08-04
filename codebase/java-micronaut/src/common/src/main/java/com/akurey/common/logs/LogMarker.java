package com.akurey.common.logs;

public class LogMarker {

  private String requestName;

  private Object request;
  private Object response;

  private int errorCode;
  private String errorMessage;

  private LogEventType eventType;
  private int eventCode;
  private String eventMessage;

  public Object getRequest() {
    return request;
  }

  public void setRequest(Object request) {
    this.request = request;
    if (request != null) {
      this.requestName = request.getClass().getCanonicalName();
    }
  }

  public Object getResponse() {
    return response;
  }

  public void setResponse(Object response) {
    this.response = response;
  }

  public int getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(int errorCode) {
    this.errorCode = errorCode;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String message) {
    this.errorMessage = message;
  }

  public int getEventCode() {
    return eventCode;
  }

  public void setEventCode(int eventCode) {
    this.eventCode = eventCode;
  }

  public String getEventMessage() {
    return eventMessage;
  }

  public void setEventMessage(String eventMessage) {
    this.eventMessage = eventMessage;
  }

  public LogEventType getEventType() {
    return eventType;
  }

  public void setEventType(LogEventType eventType) {
    this.eventType = eventType;
  }

  public String getRequestName() {
    return requestName;
  }
}

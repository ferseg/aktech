package com.akurey.common.models;

import java.util.List;

public class UserAuth {

  public final static String DEVICE_ID_KEY = "deviceId";

  private String userIdentifier;

  private List<String> roles;

  private String deviceId;

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public UserAuth setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
    return this;
  }

  public List<String> getRoles() {
    return roles;
  }

  public UserAuth setRoles(List<String> roles) {
    this.roles = roles;
    return this;
  }

  public String getDeviceId() {
    return deviceId;
  }

  public UserAuth setDeviceId(String deviceId) {
    this.deviceId = deviceId;
    return this;
  }

}

package com.akurey.common.user.models;

public enum UserRole {

  ROLE_USER(1, "ROLE_USER"),
  ROLE_ADMIN(2, "ROLE_ADMIN");

  private final Integer id;
  private final String code;

  UserRole(Integer id, String code) {
    this.id = id;
    this.code = code;
  }

  public int getId() {
    return id;
  }

  public String getCode() {
    return code;
  }
}

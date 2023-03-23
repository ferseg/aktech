package com.akurey.persistence.entities;

import java.time.LocalDateTime;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @NotNull
  private String firstName;

  private String middleName;

  @NotNull
  private String lastName;

  @NotNull
  private String email;

  // @NotNull
  @DateCreated
  private LocalDateTime created;

  // @NotNull
  @DateUpdated
  private LocalDateTime updated;
}

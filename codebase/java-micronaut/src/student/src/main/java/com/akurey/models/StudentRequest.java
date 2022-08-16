package com.akurey.models;

import io.micronaut.core.annotation.Nullable;
import lombok.Data;

@Data
public class StudentRequest {
    private String firstName;
    @Nullable
    private String middleName;
    private String lastName;
    private String email;
}

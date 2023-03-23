package com.akurey.models;

import com.akurey.common.models.BaseRequest;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.annotation.PathVariable;
import lombok.Data;

@Data
@Introspected
public class EntityIdRequest {
    @PathVariable
    Long id;
}

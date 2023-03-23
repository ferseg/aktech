package com.akurey.mappers;

import java.util.List;

public interface EntityToResponseMapper<E, R> {
    R toResponse(E entity);

    List<R> toResponses(List<E> entities);
}

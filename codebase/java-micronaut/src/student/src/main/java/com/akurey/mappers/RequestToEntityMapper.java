package com.akurey.mappers;

import java.util.List;

public interface RequestToEntityMapper<R, E> {
    E toEntity(R request);

    List<E> toEntities(List<R> requests);
}

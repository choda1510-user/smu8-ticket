package com.smu8.ticket.http.response;

import com.smu8.ticket.dto.result.PageResult;
import lombok.Builder;

import java.util.List;
import java.util.function.Function;

@Builder
public record PageResponse<T>(
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext,
        boolean hasPrevious,
        List<T> contents
) {
    public static <T, R> PageResponse<R> from(PageResult<T> result, Function<T, R> mapper) {
        return PageResponse.<R>builder()
                .page(result.currentPage())
                .size(result.pageSize())
                .totalElements(result.totalElements())
                .totalPages(result.totalPages())
                .hasNext(result.hasNext())
                .hasPrevious(result.hasPrevious())
                .contents(result.contents().stream()
                        .map(mapper)
                        .toList())
                .build();
    }
}

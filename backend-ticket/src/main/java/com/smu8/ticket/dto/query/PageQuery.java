package com.smu8.ticket.dto.query;

import lombok.Builder;

@Builder
public record PageQuery(
        int page,
        int size
) {
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 100;

    public PageQuery {
        page = Math.max(page, DEFAULT_PAGE);
        size = Math.min(Math.max(size, 1), MAX_SIZE);
    }

    public static PageQuery of(Integer page, Integer size) {
        return PageQuery.builder()
                .page(page == null ? DEFAULT_PAGE : page)
                .size(size == null ? DEFAULT_SIZE : size)
                .build();
    }

    public int zeroBasedPage() {
        return page - 1;
    }
}

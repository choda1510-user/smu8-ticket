import type { PageResponse, PageResult } from "@/types/api";


export function pageConvert<T, R>(
    response: PageResponse<T>, 
    mapper: (input: T) => R
): PageResult<R> {
    return {
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
        contents: response.contents.map(mapper)
    };
}
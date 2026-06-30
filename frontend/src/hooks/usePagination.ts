import {useCallback, useEffect, useState} from "react";
import type {PageRequest, PageResponse} from "@/types/api";

type PageFetcher<T, F> = (
    request: PageRequest,
    filters: F,
) => Promise<PageResponse<T>>;

type UsePaginationOptions<T, F> = {
    pageSize: number;
    initialFilters: F;
    fetchPage: PageFetcher<T, F>;
};

export function usePagination<T, F>({
    pageSize,
    initialFilters,
    fetchPage,
}: UsePaginationOptions<T, F>) {
    const [pageResult, setPageResult] = useState<PageResponse<T>>({
        page: 1,
        size: pageSize,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        contents: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadPage() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetchPage(
                    {page: currentPage - 1, size: pageSize},
                    filters,
                );

                if (isMounted) {
                    setPageResult(response);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error
                        ? caughtError
                        : new Error("페이지를 불러오지 못했습니다."));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadPage();

        return () => {
            isMounted = false;
        };
    }, [currentPage, fetchPage, filters, pageSize]);

    const totalPages = Math.max(1, pageResult.totalPages);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const search = useCallback((nextFilters: F) => {
        setCurrentPage(1);
        setFilters(nextFilters);
    }, []);

    const changePage = useCallback((page: number) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    }, [totalPages]);

    const previousPage = useCallback(() => {
        changePage(currentPage - 1);
    }, [changePage, currentPage]);

    const nextPage = useCallback(() => {
        changePage(currentPage + 1);
    }, [changePage, currentPage]);

    return {
        pageResult,
        currentPage,
        totalPages,
        isLoading,
        error,
        search,
        changePage,
        previousPage,
        nextPage,
    };
}

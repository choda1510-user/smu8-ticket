import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router";
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
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get("page"));
    const currentPage = Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;
    const [pageResult, setPageResult] = useState<PageResponse<T>>({
        page: 1,
        size: pageSize,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        contents: [],
    });
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

    const changePage = useCallback((page: number) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.set("page", String(nextPage));
        setSearchParams(nextSearchParams);
    }, [searchParams, setSearchParams, totalPages]);

    useEffect(() => {
        if (pageResult.totalPages > 0 && currentPage > totalPages) {
            changePage(totalPages);
        }
    }, [changePage, currentPage, pageResult.totalPages, totalPages]);

    const search = useCallback((nextFilters: F) => {
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.set("page", "1");
        setSearchParams(nextSearchParams);
        setFilters(nextFilters);
    }, [searchParams, setSearchParams]);

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

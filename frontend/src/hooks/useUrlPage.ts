import {useCallback} from "react";
import {useSearchParams} from "react-router";

function parsePage(searchParams: URLSearchParams) {
    const page = Number(searchParams.get("page"));

    return Number.isInteger(page) && page > 0 ? page : 1;
}

export function useUrlPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parsePage(searchParams);

    const changePage = useCallback((
        page: number,
        totalPages?: number,
        replace = false,
    ) => {
        const maximumPage = totalPages && totalPages > 0
            ? totalPages
            : Number.MAX_SAFE_INTEGER;
        const nextPage = Math.min(Math.max(page, 1), maximumPage);
        const nextSearchParams = new URLSearchParams(searchParams);

        nextSearchParams.set("page", String(nextPage));
        setSearchParams(nextSearchParams, {replace});
    }, [searchParams, setSearchParams]);

    return {
        currentPage,
        changePage,
    };
}

import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {getConcertSearchPage} from "@/apis/concertApi";
import {useUrlPage} from "@/hooks/useUrlPage";
import type {ConcertItemPageResult} from "@/types/concert";

const initialConcertSearchResults: ConcertItemPageResult = {
    contents: [],
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
};

function getKeyword(searchParams: URLSearchParams) {
    return searchParams.get("keyword") ?? searchParams.get("q") ?? "";
}

export function useConcertSearchResultPage() {
    const [searchParams] = useSearchParams();
    const keyword = getKeyword(searchParams);
    const {currentPage, changePage} = useUrlPage();
    const [concertSearchResults, setConcertSearchResults] = useState<ConcertItemPageResult>(initialConcertSearchResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadConcerts() {
            try {
                setIsLoading(true);
                setError(null);

                const concerts = await getConcertSearchPage(
                    {page: currentPage - 1, size: 10},
                    keyword,
                );

                if (isMounted) {
                    setConcertSearchResults(concerts);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadConcerts();

        return () => {
            isMounted = false;
        };
    }, [currentPage, keyword]);

    return {
        concertSearchResults,
        currentPage,
        changePage,
        isLoading,
        error,
    };
}

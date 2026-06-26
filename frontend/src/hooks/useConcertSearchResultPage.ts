import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {filterConcertsByKeyword, getConcertList, toConcertSearchResult} from "@/apis/concertApi";
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
    const [concertSearchResults, setConcertSearchResults] = useState<ConcertItemPageResult>(initialConcertSearchResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadConcerts() {
            try {
                setIsLoading(true);
                setError(null);

                const concerts = filterConcertsByKeyword(await getConcertList(), keyword)
                    .map(toConcertSearchResult);

                if (isMounted) {
                    setConcertSearchResults({
                        contents: concerts,
                        page: 1,
                        size: concerts.length,
                        totalElements: concerts.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrevious: false
                    });
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
    }, [keyword]);

    return {
        concertSearchResults,
        isLoading,
        error,
    };
}

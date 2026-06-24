import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {filterConcertsByKeyword, getConcertList, toConcertSearchResult} from "@/apis/concertApi";
import type {ConcertSearchResultResponse} from "@/types/concert";

const initialConcertSearchResults: ConcertSearchResultResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

function getKeyword(searchParams: URLSearchParams) {
    return searchParams.get("keyword") ?? searchParams.get("q") ?? "";
}

export function useConcertSearchResultPage() {
    const [searchParams] = useSearchParams();
    const keyword = getKeyword(searchParams);
    const [concertSearchResults, setConcertSearchResults] = useState<ConcertSearchResultResponse>(initialConcertSearchResults);
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
                        data: concerts,
                        page: 1,
                        totalPage: 1,
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

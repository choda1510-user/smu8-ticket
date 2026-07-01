import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {getVenueSearchPage} from "@/apis/venueApi";
import {useUrlPage} from "@/hooks/useUrlPage";
import type {VenueSearchPageResult} from "@/types/venue";

const initialVenueSearchResults: VenueSearchPageResult = {
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

export function useConcertHoleSearchResultPage() {
    const [searchParams] = useSearchParams();
    const keyword = getKeyword(searchParams);
    const {currentPage, changePage} = useUrlPage();
    const [venueSearchResults, setVenueSearchResults] = useState<VenueSearchPageResult>(initialVenueSearchResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadVenues() {
            try {
                setIsLoading(true);
                setError(null);

                const venues = await getVenueSearchPage(
                    {page: currentPage - 1, size: 4},
                    keyword,
                );

                if (isMounted) {
                    setVenueSearchResults(venues);
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

        void loadVenues();

        return () => {
            isMounted = false;
        };
    }, [currentPage, keyword]);

    return {
        venueSearchResults,
        currentPage,
        changePage,
        isLoading,
        error,
    };
}

import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {filterVenuesByKeyword, getVenueList, toVenueSearchResult} from "@/apis/venueApi";
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
    const [venueSearchResults, setVenueSearchResults] = useState<VenueSearchPageResult>(initialVenueSearchResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadVenues() {
            try {
                setIsLoading(true);
                setError(null);

                const venues = filterVenuesByKeyword(await getVenueList(), keyword)
                    .map(toVenueSearchResult);

                if (isMounted) {
                    setVenueSearchResults({
                        contents: venues,
                        page: 1,
                        size: venues.length,
                        totalElements: venues.length,
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

        void loadVenues();

        return () => {
            isMounted = false;
        };
    }, [keyword]);

    return {
        venueSearchResults,
        isLoading,
        error,
    };
}

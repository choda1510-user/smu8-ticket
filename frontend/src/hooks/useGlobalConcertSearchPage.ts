import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {
    filterConcertsByKeyword,
    getConcertList,
    toConcertResult,
} from "@/apis/concertApi";
import {filterVenuesByKeyword, getVenueList, toVenueResult} from "@/apis/venueApi";
import type {ConcertItemPageResult} from "@/types/concert";
import type { VenueSearchPageResult} from "@/types/venue";

const initialConcertResults: ConcertItemPageResult = {
    contents: [],
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,

};
const initialVenueResults: VenueSearchPageResult = {
    contents: [],
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
};

function getKeyword(searchParams: URLSearchParams) {
    return searchParams.get("keyword") ?? searchParams.get("q") ?? "";
}

export function useGlobalConcertSearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = getKeyword(searchParams);
    const [concertResults, setConcertResults] = useState<ConcertItemPageResult>(initialConcertResults);
    const [venueResults, setVenueResults] = useState<VenueSearchPageResult>(initialVenueResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSearchResults() {
            try {
                setIsLoading(true);
                setError(null);

                const [concerts, venues] = await Promise.all([
                    getConcertList(),
                    getVenueList(),
                ]);
                const filteredConcerts = filterConcertsByKeyword(concerts, keyword);
                const filteredVenues = filterVenuesByKeyword(venues, keyword);

                if (isMounted) {
                    setConcertResults({
                        contents: filteredConcerts.map(toConcertResult),
                        page: 1,
                        size: filteredConcerts.length,
                        totalElements: filteredConcerts.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrevious: false,
                    });
                    setVenueResults({
                        contents: filteredVenues.map(toVenueResult),
                        page: 1,
                        size: filteredVenues.length,
                        totalElements: filteredVenues.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrevious: false,
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

        void loadSearchResults();

        return () => {
            isMounted = false;
        };
    }, [keyword]);

    return {
        concertResults,
        venueResults,
        isLoading,
        error,
    };
}

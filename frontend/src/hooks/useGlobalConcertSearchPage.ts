import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {
    filterConcertsByKeyword,
    getConcertList,
    toConcertResult,
} from "@/apis/concertApi";
import {filterVenuesByKeyword, getVenueList, toVenueResult} from "@/apis/venueApi";
import type {ConcertResultResponse} from "@/types/concert";
import type {VenueResultResponse} from "@/types/venue";

const initialConcertResults: ConcertResultResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};
const initialVenueResults: VenueResultResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

function getKeyword(searchParams: URLSearchParams) {
    return searchParams.get("keyword") ?? searchParams.get("q") ?? "";
}

export function useGlobalConcertSearchPage() {
    const [searchParams] = useSearchParams();
    const keyword = getKeyword(searchParams);
    const [concertResults, setConcertResults] = useState<ConcertResultResponse>(initialConcertResults);
    const [venueResults, setVenueResults] = useState<VenueResultResponse>(initialVenueResults);
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
                        data: filteredConcerts.map(toConcertResult),
                        page: 1,
                        totalPage: 1,
                    });
                    setVenueResults({
                        data: filteredVenues.map(toVenueResult),
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

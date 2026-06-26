import {useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {filterVenuesByKeyword, getVenueList, toVenueSearchResult} from "@/apis/venueApi";
import type {VenueSearchPageResult} from "@/types/venue";

const initialVenueSearchResults: VenueSearchPageResult = {
    contents: [],
    page: 1, // 현재 페이지 번호
    size: 0,// 페이지 하나당 데이터 개수
    totalElements: 0, // 전체 데이터 개수
    totalPages: 1, // 전체 페이지 수
    hasNext: false, // 다음 페이지 존재 여부
    hasPrevious: false // 이전 페이지 존재 여부
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
                        data: venues,
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

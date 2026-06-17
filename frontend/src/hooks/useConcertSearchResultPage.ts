import {useFetchJson} from "@/hooks/useFetchJson";
import type {ListResponse} from "@/types/api";

export type ConcertSearchResult = {
    concertId: number;
    venueId: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueName: string;
    badgeText: string;
};
const concertSearchResultsUrl = new URL("../data/concertSearchResults.json", import.meta.url).href;
const initialConcertSearchResults: ListResponse<ConcertSearchResult> = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertSearchResultPage() {
    const {data: concertSearchResults} = useFetchJson<ListResponse<ConcertSearchResult>>(
        concertSearchResultsUrl,
        initialConcertSearchResults
    );

    return {
        concertSearchResults,
    };
}

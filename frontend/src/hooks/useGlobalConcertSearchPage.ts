import {useFetchJson} from "@/hooks/useFetchJson";
import type {ListResponse} from "@/types/api";

export type ConcertResult = {
    id: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueId: number;
    venueName: string;
    status: string;
};

export type VenueResult = {
    id: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

const concertResultsUrl = new URL("../data/globalConcertResults.json", import.meta.url).href;
const venueResultsUrl = new URL("../data/globalVenueResults.json", import.meta.url).href;
const initialConcertResults: ListResponse<ConcertResult> = {
    data: [],
    page: 1,
    totalPage: 1,
};
const initialVenueResults: ListResponse<VenueResult> = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useGlobalConcertSearchPage() {
    const {data: concertResults} = useFetchJson<ListResponse<ConcertResult>>(concertResultsUrl, initialConcertResults);
    const {data: venueResults} = useFetchJson<ListResponse<VenueResult>>(venueResultsUrl, initialVenueResults);

    return {
        concertResults,
        venueResults,
    };
}

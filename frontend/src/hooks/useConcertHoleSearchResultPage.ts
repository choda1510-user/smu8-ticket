import {useFetchJson} from "@/hooks/useFetchJson";
import type {ListResponse} from "@/types/api";

export type VenueSearchResult = {
    venueId: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

const venueSearchResultsUrl = new URL("../data/venueSearchResults.json", import.meta.url).href;
const initialVenueSearchResults: ListResponse<VenueSearchResult> = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertHoleSearchResultPage() {
    const {data: venueSearchResults} = useFetchJson<ListResponse<VenueSearchResult>>(
        venueSearchResultsUrl,
        initialVenueSearchResults
    );

    return {
        venueSearchResults,
    };
}

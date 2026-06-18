import {useFetchJson} from "@/hooks/useFetchJson";
import type {VenueSearchResultResponse} from "@/types/venue";

const venueSearchResultsUrl = new URL("../data/venueSearchResults.json", import.meta.url).href;
const initialVenueSearchResults: VenueSearchResultResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertHoleSearchResultPage() {
    const {data: venueSearchResults} = useFetchJson<VenueSearchResultResponse>(
        venueSearchResultsUrl,
        initialVenueSearchResults
    );

    return {
        venueSearchResults,
    };
}

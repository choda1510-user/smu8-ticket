import {useFetchJson} from "@/hooks/useFetchJson";
import type {ConcertResultResponse} from "@/types/concert";
import type {VenueResultResponse} from "@/types/venue";

const concertResultsUrl = new URL("../data/globalConcertResults.json", import.meta.url).href;
const venueResultsUrl = new URL("../data/globalVenueResults.json", import.meta.url).href;
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

export function useGlobalConcertSearchPage() {
    const {data: concertResults} = useFetchJson<ConcertResultResponse>(concertResultsUrl, initialConcertResults);
    const {data: venueResults} = useFetchJson<VenueResultResponse>(venueResultsUrl, initialVenueResults);

    return {
        concertResults,
        venueResults,
    };
}

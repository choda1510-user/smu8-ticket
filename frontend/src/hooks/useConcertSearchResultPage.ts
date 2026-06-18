import {useFetchJson} from "@/hooks/useFetchJson";
import type {ConcertSearchResultResponse} from "@/types/concert";

const concertSearchResultsUrl = new URL("../data/concertSearchResults.json", import.meta.url).href;
const initialConcertSearchResults: ConcertSearchResultResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertSearchResultPage() {
    const {data: concertSearchResults} = useFetchJson<ConcertSearchResultResponse>(
        concertSearchResultsUrl,
        initialConcertSearchResults
    );

    return {
        concertSearchResults,
    };
}

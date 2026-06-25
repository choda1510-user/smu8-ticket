import type { VenueSearch, VenueSearchPageResponse, VenueSearchPageResult, VenueSearchResponse } from "@/types/venue";
import { pageConvert } from "./commonConvertor";


export function convertVenueSearch(response: VenueSearchResponse) : VenueSearch {
    return {
        id: response.venueId,
        venueName: response.venueName,
        availableConcertCount: response.availableConcertCount
    };
};
export function convertVenueSearchPage(response: VenueSearchPageResponse): VenueSearchPageResult {
    return pageConvert(response, convertVenueSearch);
};
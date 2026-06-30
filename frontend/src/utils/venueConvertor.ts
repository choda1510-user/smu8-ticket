import type { VenueSearch, VenueItemPageResponse, VenueSearchPageResult, VenueItemResponse } from "@/types/venue";
import { pageConvert } from "./commonConvertor";


export function convertVenueSearch(response: VenueItemResponse) : VenueSearch {
    return {
        id: response.id,
        venueName: response.name,
        availableConcertCount: response.availableConcertCount
    };
};
export function convertVenueSearchPage(response: VenueItemPageResponse): VenueSearchPageResult {
    return pageConvert(response, convertVenueSearch);
};
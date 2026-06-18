import type {ListResponse} from "@/types/api";

export type VenueSearchResult = {
    venueId: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

export type VenueResult = {
    id: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

export type VenueSearchResultResponse = ListResponse<VenueSearchResult>;
export type VenueResultResponse = ListResponse<VenueResult>;

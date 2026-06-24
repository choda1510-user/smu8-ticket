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

export type BackendVenue = {
    id: number;
    name: string;
    zoneNo: string;
    roadAddress: string;
    jibunAddress: string;
    detailAddress: string;
    buildingName: string;
    createdAt?: string;
    updatedAt?: string;
};

export type BackendVenueListResponse = {
    venues: BackendVenue[];
};

export type AdminVenueRequest = {
    name: string;
    zoneNo: string;
    roadAddress: string;
    jibunAddress: string;
    detailAddress: string;
    buildingName: string;
};

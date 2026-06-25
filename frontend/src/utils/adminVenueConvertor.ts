import type {
    AdminVenueItem,
    AdminVenueItemResponse,
    AdminVenuePageResponse,
    AdminVenuePageResult
} from "@/types/adminVenue.ts";

export const toAdminVenueItem = (
    response: AdminVenueItemResponse,
): AdminVenueItem => ({
    id: response.id,
    venueCode: response.venue_code,
    venueName: response.venue_name,
    address: [
        response.roadAddress,
        response.detailAddress,
    ].filter(Boolean).join(" "),
});

export const toAdminVenuePageResult = (
    response: AdminVenuePageResponse,
): AdminVenuePageResult =>({
    page: response.page,
    size: response.size,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    hasNext: response.hasNext,
    hasPrevious: response.hasPrevious,
    contents: response.contents.map(toAdminVenueItem),
});
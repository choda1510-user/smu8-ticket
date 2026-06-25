import type {
    AdminConcertDetails,
    AdminConcertDetailsResponse,
    AdminConcertImageResponse,
    AdminConcertImageResult,
    AdminConcertItem,
    AdminConcertListPageResponse,
    AdminConcertListPageResult,
    AdminConcertResponse,
    AdminConcertSeatPolicyResponse,
    AdminConcertSeatPolicyResult,
    AdminConcertSeatResponse,
    AdminConcertSeatResult,
    AdminConcertSeatTypeResponse,
    AdminConcertSeatTypeResult,
    AdminConcertSessionResponse,
    AdminConcertSessionResult,
} from "@/types/adminConcert.ts";

export const toAdminConcertSessionResult = (
    response: AdminConcertSessionResponse,
): AdminConcertSessionResult => ({
    id: response.id,
    concertId: response.concertId,
    date: response.date,
    time: response.time,
    reservationEndAt: response.reservationEndAt,
});

export const toAdminConcertImageResult = (
    response: AdminConcertImageResponse,
): AdminConcertImageResult => ({
    cardPosterUrl: response.card_poster_url,
    screenPosterUrl: response.screen_poster_url,
    descriptionImageUrl: response.description_image_url,
});

export const toAdminConcertSeatTypeResult = (
    response: AdminConcertSeatTypeResponse,
): AdminConcertSeatTypeResult => ({
    seatTypeId: response.seat_type_id,
    seatTypeName: response.seat_type_name,
    price: response.price,
});

export const toAdminConcertSeatResult = (
    response: AdminConcertSeatResponse,
): AdminConcertSeatResult => ({
    rowIndex: response.row_index,
    columnIndex: response.column_index,
    seatTypeId: response.seat_type_id,
});

export const toAdminConcertSeatPolicyResult = (
    response: AdminConcertSeatPolicyResponse,
): AdminConcertSeatPolicyResult => ({
    rowCount: response.row_count,
    columnCount: response.column_count,
    seatTypes: response.seat_types.map(toAdminConcertSeatTypeResult),
    seats: response.seats.map(toAdminConcertSeatResult),
});

const getConcertPeriodText = (
    sessions: AdminConcertSessionResponse[],
): string => {
    if (sessions.length === 0) {
        return "-";
    }

    const dates = sessions.map((session) => session.date).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    return startDate === endDate ? startDate : `${startDate} ~ ${endDate}`;
};

export const toAdminConcertItem = (
    response: AdminConcertResponse,
): AdminConcertItem => ({
    id: response.id,
    concertCode: response.concert_code,
    title: response.title,
    periodText: getConcertPeriodText(response.sessions),
    venueName: response.venueName,
    reservationStatus: response.reservationStatus,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
});

export const toAdminConcertDetails = (
    response: AdminConcertDetailsResponse,
): AdminConcertDetails => ({
    id: response.id,
    concertCode: response.concert_code,
    title: response.title,
    runningTime: response.runningTime,
    reservationStartAt: response.reservationStartAt,
    reservationStatus: response.reservationStatus,
    venueId: response.venueId,
    venueName: response.venueName,
    venueCode: response.venue_code,
    notice: response.notice,
    description: response.description,
    sessions: response.sessions.map(toAdminConcertSessionResult),
    images: response.images
        ? toAdminConcertImageResult(response.images)
        : undefined,
    seatPolicy: response.seat_policy
        ? toAdminConcertSeatPolicyResult(response.seat_policy)
        : undefined,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
});

export const toAdminConcertListPageResult = (
    response: AdminConcertListPageResponse,
): AdminConcertListPageResult =>
    ({
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
        contents: response.contents.map(toAdminConcertItem),

    });
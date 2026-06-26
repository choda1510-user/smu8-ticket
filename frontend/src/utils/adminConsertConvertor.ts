import type {
    AdminConcertDetails,
    AdminConcertDetailsResponse,
    AdminConcertImageResult,
    AdminConcertItem,
    AdminConcertListPageResponse,
    AdminConcertListPageResult,
    AdminConcertSeatPolicyResult,
    AdminConcertSeatResult,
    AdminConcertSeatTypeResult,
    AdminConcertScheduleResponse,
    AdminConcertSessionResult,
} from "@/types/adminConcert.ts";
import { splitDatetime } from "./dateUtil";
import type { SeatGradeResponse, SeatResponse } from "@/types/concert";

export const toAdminConcertSessionResult = (
    response: AdminConcertScheduleResponse,
): AdminConcertSessionResult => {
    const [ date, time ] = splitDatetime(new Date(response.date));
    return {
        id: response.id,
        concertId: response.concertId,
        date: date,
        time: time,
        reservationEndAt: response.reservationEndAt,
    }
};

export const toAdminConcertImageResult = (
    response: AdminConcertDetailsResponse,
): AdminConcertImageResult => ({
    cardPosterUrl: response.cardPosterUrl,
    screenPosterUrl: response.bannerPosterUrl,
    descriptionImageUrl: response.descriptionPosterUrl,
});

export const toAdminConcertSeatTypeResult = (
    response: SeatGradeResponse,
): AdminConcertSeatTypeResult => ({
    seatTypeId: response.id.toString(),
    seatTypeName: response.gradeName,
    price: response.price,
});

export const toAdminConcertSeatResult = (
    response: SeatResponse,
): AdminConcertSeatResult => ({
    rowIndex: response.row,
    columnIndex: response.col,
    seatTypeId: response.seatGradeId.toString(),
});

export const toAdminConcertSeatPolicyResult = (
    response: AdminConcertDetailsResponse,
): AdminConcertSeatPolicyResult => {

    return {
        rowCount: response.rowMax,
        columnCount: response.colMax,
        seatTypes: response.seatGrades.map(toAdminConcertSeatTypeResult),
        seats: response.seats.map(toAdminConcertSeatResult),
    }
};

const getConcertPeriodText = (
    sessions: AdminConcertScheduleResponse[],
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
    response: AdminConcertDetailsResponse,
): AdminConcertItem => ({
    id: response.id,
    concertCode: response.concertCode,
    title: response.title,
    periodText: getConcertPeriodText(response.schedules),
    venueName: response.venueName,
    reservationStatus: response.reservationStatus,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
});

export const toAdminConcertDetails = (
    response: AdminConcertDetailsResponse,
): AdminConcertDetails => ({
    id: response.id,
    concertCode: response.concertCode,
    title: response.title,
    runningTime: response.runningTime,
    reservationStartAt: response.reservationStartAt,
    reservationStatus: response.reservationStatus,
    venueId: response.venueId,
    venueName: response.venueName,
    venueCode: response.venueId.toString(),
    notice: response.notice,
    description: response.description,
    sessions: response.schedules.map(toAdminConcertSessionResult),
    images: toAdminConcertImageResult(response),
    seatPolicy: toAdminConcertSeatPolicyResult(response),
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
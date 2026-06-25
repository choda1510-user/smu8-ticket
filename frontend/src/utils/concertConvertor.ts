import type { ConcertDetail, ConcertDetailResponse, ConcertItem, ConcertItemResponse, ConcertSchedule, ConcertScheduleResponse } from "@/types/concert";
import { compareDateAsc, compareDateDesc, splitDatetime, stringToDate } from "./dateUtil";

export function convertConcertSchedule(response: ConcertScheduleResponse): ConcertSchedule {
    const datetime = stringToDate(response.date);
    const [ date, time ] = splitDatetime(datetime);
    return {
        id: response.id,
        date: date,
        time: time,
        datetime: datetime,
        reservationEndAt: response.reservationEndAt
    };
};
export function convertConcertDetail(response: ConcertDetailResponse): ConcertDetail {
    const schedules = response.schedules.map(convertConcertSchedule);

    schedules.sort((schedules1, schedules2) => {
        return compareDateAsc(schedules1.datetime, schedules2.datetime)
    })
    const startAt = schedules.at(0)?.date;

    schedules.sort((schedules1, schedules2) => {
        return compareDateDesc(schedules1.datetime, schedules2.datetime)
    })
    const endAt = schedules.at(0)?.date;

    if (startAt === undefined || endAt === undefined) {
        throw new Error("공연 회차가 없음");
    }
    return {
        id: response.id,
        venueId: response.venueId,
        posterUrl: response.posterUrl,
        concertTitle: response.concertTitle,
        concertPeriod: response.concertPeriod,
        runningTime: response.runningTime,
        venueName: response.venueName,
        reservationPeriod: response.reservationPeriod,
        schedules: response.schedules.map(convertConcertSchedule),
        description: response.description,
        startAt: startAt,
        endAt: endAt,
        reservationStartAt: response.reservationStartAt
    }
}

export function datesToPeriod(dates: string[]): string {
    return "";
}
export function badgeTextFrom(response: ConcertItemResponse): string {
    return "";
}
export function convertConcertItem(response: ConcertItemResponse): ConcertItem {
    return {
        concertId: response.concertId,
        posterUrl: response.cardPosterUrl,
        title: response.title,
        period: datesToPeriod(response.dates.map((date) => date.date)),
        venueName: response.venueName,
        badgeText: badgeTextFrom(response)
    }
}

import type {
    ConcertDetail,
    ConcertDetailResponse,
    ConcertItem,
    ConcertItemPageResponse,
    ConcertItemResponse,
    ConcertSchedule,
    ConcertScheduleResponse

} from "@/types/concert";
import type {
    AdminConcertCreateCommand,
    AdminConcertCreateResponse,
    AdminConcertDetailResponse,
    AdminConcertListPageResponse,
    AdminConcertUpdateCommand,
    AdminConcertUpdateResponse,
} from "@/types/adminConcert.ts";

import type {VenueSearch, VenueItemResponse} from "@/types/venue";
import { getAccessToken } from "./authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function createJsonHeaders() {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    const accessToken = getAccessToken();

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
}

function createMultipartHeaders() {
    const headers: HeadersInit = {};
    const accessToken = getAccessToken();

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
}

function createConcertFormData(command: AdminConcertCreateCommand) {
    const formData = new FormData();

    formData.append(
        "request",
        new Blob([JSON.stringify(command.request)], {type: "application/json"}),
    );
    formData.append("cardPoster", command.cardPoster);
    formData.append("bannerPoster", command.bannerPoster);
    formData.append("descriptionPoster", command.descriptionPoster);

    return formData;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`API request failed. status=${response.status}`);
    }

    return (await response.json()) as T;
}

async function fetchEmpty(url: string, options?: RequestInit): Promise<void> {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`API request failed. status=${response.status}`);
    }
}

function formatDateTime(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function formatPeriod(startAt: string, endAt: string) {
    const startText = formatDateTime(startAt);
    const endText = formatDateTime(endAt);

    if (!startText && !endText) {
        return "";
    }

    return `${startText} ~ ${endText}`;
}


function toConcertSchedule(schedule: ConcertScheduleResponse) {
    const date = new Date(schedule.date);

    return {
        id: schedule.id,
        date: Number.isNaN(date.getTime()) ? schedule.date : schedule.date.slice(0, 10),
        time: Number.isNaN(date.getTime()) ? "" : date.toTimeString().slice(0, 5),
        datetime: date,
        reservationEndAt: schedule.reservationEndAt,
    };
}

function formatPeriodBySchedules(schedules: ConcertItemResponse["dates"]) {
    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();

    if (dates.length === 0) {
        return "";
    }

    return formatPeriod(dates[0], dates[dates.length - 1]);
}

function formatReservationPeriod(reservationStartAt: string | undefined, schedules: ConcertSchedule[]) {
    const reservationEndDates = schedules.map((schedule) => schedule.reservationEndAt).filter(Boolean).sort();
    const reservationEndAt = reservationEndDates[reservationEndDates.length - 1];

    if (!reservationStartAt && !reservationEndAt) {
        return "";
    }

    return `${formatDateTime(reservationStartAt ?? "")} ~ ${formatDateTime(reservationEndAt ?? "")}`;
}

function getBadgeText(reservationStartAt: string) {
    const diff = Math.ceil(
        (new Date(reservationStartAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return "예매중";
}

function toConcertItem(concert: ConcertItemResponse): ConcertItem {
    return {
        concertId: concert.concertId,
        posterUrl: concert.cardPosterUrl,
        title: concert.title,
        period: formatPeriodBySchedules(concert.dates),
        venueId: concert.venueId,
        venueName: concert.venueName,
        badgeText: getBadgeText(concert.reservationStartAt),
    };
}

export function toConcertSearchResult(concert: ConcertItemResponse): ConcertItem {
    return toConcertItem(concert);
}

export function toConcertDetail(concert: ConcertDetailResponse): ConcertDetail {
    const schedules = concert.schedules.map(toConcertSchedule);
    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();

    return {
        id: concert.id,
        venueId: concert.venueId,
        posterUrl: concert.posterUrl,
        concertTitle: concert.title,
        concertPeriod: dates.length > 0 ? `${dates[0]} ~ ${dates[dates.length - 1]}` : "",
        runningTime: concert.runningTime,
        venueName: concert.venueName,
        reservationPeriod: formatReservationPeriod(concert.reservationStartAt, schedules),
        schedules,
        description: concert.description,
        descriptionPosterUrl: concert.descriptionPosterUrl,
        notice: concert.notice,
        startAt: dates[0] ?? "",
        endAt: dates[dates.length - 1] ?? "",
        reservationStartAt: concert.reservationStartAt,
    };
}

export function toConcertResult(concert: ConcertItemResponse): ConcertItem {
    return toConcertItem(concert);
    }


export function toVenueSearchResult(concerts: ConcertItemResponse[]): VenueItemResponse[] {
    const venueMap = new Map<number, VenueItemResponse>();

    concerts.forEach((concert) => {
        const existingVenue = venueMap.get(concert.venueId);

        if (existingVenue) {
            existingVenue.availableConcertCount += 1;
            return;
        }

        venueMap.set(concert.venueId, {
            id: concert.venueId,
            name: concert.venueName,
            availableConcertCount: 1,
        });
    });

    return Array.from(venueMap.values());
}

export function toVenueResult(concerts: ConcertItemResponse[]): VenueSearch[] {
    return toVenueSearchResult(concerts).map((venue) => ({
        id: venue.id,
        venueName: venue.name,
        availableConcertCount: venue.availableConcertCount,
    }));
}

export function filterConcertsByKeyword(concerts: ConcertItemResponse[], keyword: string) {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
        return concerts;
    }

    return concerts.filter((concert) => {
        return (
            (concert.title ?? "").toLowerCase().includes(normalizedKeyword) ||
            (concert.venueName ?? "").toLowerCase().includes(normalizedKeyword)
        );
    });
}

//export function toConcertDetail(concert: ConcertResponse): ConcertDetail {
 //   return {
   //     id: concert.id,
     //   venueId: concert.venueId,
       // concertTitle: concert.title,
       // concertPeriod: formatPeriod(concert.startAt, concert.endAt),
      //  runningTime: "",
      //  venueName: concert.venueName,
      //  reservationPeriod: "",
       // schedules: concert.startAt
       //     ? [
        //        {
        //            id: concert.id,
        //            date: formatDateTime(concert.startAt),
         //           time: "",
         //       },
          //  ]
          //  : [],
       // description: concert.description,
      //  startAt: concert.startAt,
      //  endAt: concert.endAt,
   // };
// }

export async function getConcert(id: number): Promise<ConcertDetail> {
    const concert = await fetchJson<ConcertDetailResponse>(`${API_BASE_URL}/api/concerts/${id}`);
    return toConcertDetail(concert);
}

export async function getConcertList(): Promise<ConcertItemResponse[]> {
    const response = await fetchJson<ConcertItemPageResponse>(`${API_BASE_URL}/api/concerts`);
    return response.contents ?? [];
}

export async function getConcertItems(): Promise<ConcertItem[]> {
    const concerts = await getConcertList();
    return concerts.map(toConcertItem);
}

export async function getAdminConcert(id: number): Promise<AdminConcertDetailResponse> {
    return fetchJson<AdminConcertDetailResponse>(`${API_BASE_URL}/api/admin/concerts/${id}`, {
        headers: createJsonHeaders(),
    });
}

export async function getAdminConcertList(): Promise<AdminConcertDetailResponse[]> {
    const response = await fetchJson<AdminConcertListPageResponse>(`${API_BASE_URL}/api/admin/concerts`, {
        headers: createJsonHeaders(),
    });

    return response.contents ?? [];
}

export async function addConcert(
    command: AdminConcertCreateCommand
): Promise<AdminConcertCreateResponse> {
    return fetchJson<AdminConcertCreateResponse>(`${API_BASE_URL}/api/admin/concerts`, {
        method: "POST",
        headers: createMultipartHeaders(),
        body: createConcertFormData(command),
    });
}

export async function updateConcert(command: AdminConcertUpdateCommand): Promise<AdminConcertUpdateResponse> {
    return fetchJson<AdminConcertCreateResponse>(`${API_BASE_URL}/api/admin/concerts/${command.pathVariables.id}`, {
        method: "PATCH",
        headers: createJsonHeaders(),
        body: JSON.stringify(command.request),
    });
}

export async function cancelConcert(id: number): Promise<void> {
    await fetchEmpty(`${API_BASE_URL}/api/admin/concerts/${id}`, {
        method: "DELETE",
        headers: createJsonHeaders(),
    });
}


// 기존 오타 함수명을 쓰는 코드가 있어도 깨지지 않도록 잠시 유지합니다.

export function getConcertListOnBanner() {
    return getConcertItems();
}

export function getConcertWithSeats(id: number) {
    return getAdminConcert(id);
}

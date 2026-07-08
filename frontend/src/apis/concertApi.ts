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
    AdminConcertUpdateBasicInfoCommand, AdminConcertListPageParameters,
} from "@/types/adminConcert.ts";

import { formatKstDateTime, parseUtcDateTime } from "@/utils/dateUtil";
import type {VenueSearch, VenueItemResponse} from "@/types/venue";
import type {PageRequest} from "@/types/api";
import {pageConvert} from "@/utils/commonConvertor";
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
        let errorMessage = `API request failed. status=${response.status}`;

        try {
            const errorBody = await response.json();

            if (typeof errorBody?.message === "string" && errorBody.message.trim()) {
                errorMessage = errorBody.message;
            }
        } catch {
            // Ignore non-JSON error bodies and keep the default status message.
        }

        throw new Error(errorMessage);
    }

    return (await response.json()) as T;
}

async function fetchEmpty(url: string, options?: RequestInit): Promise<void> {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`API request failed. status=${response.status}`);
    }
}

function formatPeriod(startAt: string, endAt: string) {
    const startText = formatKstDateTime(startAt);
    const endText = formatKstDateTime(endAt);

    if (!startText && !endText) {
        return "";
    }

    return `${startText} ~ ${endText}`;
}


function toConcertSchedule(schedule: ConcertScheduleResponse) {
    const date = parseUtcDateTime(schedule.date);

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

function getReservationEndAt(schedules: ConcertItemResponse["dates"]) {
    const dates = schedules.map((schedule) => schedule.reservationEndAt).filter(Boolean).sort();

    return dates[dates.length - 1] ?? "";
}

function formatReservationPeriod(reservationStartAt: string | undefined, schedules: ConcertSchedule[]) {
    const reservationEndDates = schedules.map((schedule) => schedule.reservationEndAt).filter(Boolean).sort();
    const reservationEndAt = reservationEndDates[reservationEndDates.length - 1];

    if (!reservationStartAt && !reservationEndAt) {
        return "";
    }

    return `${formatKstDateTime(reservationStartAt ?? "")} ~ ${formatKstDateTime(reservationEndAt ?? "")}`;
}

function getBadgeText(reservationStartAt: string) {
   const today = new Date();
   const target = parseUtcDateTime(reservationStartAt);

   const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
   const targetDate = parseUtcDateTime(target.getFullYear(), target.getMonth(), target.getDate());

    const diff = Math.ceil(
        (targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return "예매중";
}

function toConcertItem(concert: ConcertItemResponse): ConcertItem {
    return {
        concertId: concert.concertId,
        posterUrl: concert.cardPosterUrl,
        bannerPosterUrl: concert.bannerPosterUrl,
        title: concert.title,
        period: formatPeriodBySchedules(concert.dates),
        reservationStartAt: concert.reservationStartAt,
        reservationEndAt: getReservationEndAt(concert.dates),
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

export async function getConcert(id: number): Promise<ConcertDetail> {
    const concert = await fetchJson<ConcertDetailResponse>(`${API_BASE_URL}/api/concerts/${id}`);
    return toConcertDetail(concert);
}

export async function getConcertList(): Promise<ConcertItemResponse[]> {
    const response = await fetchJson<ConcertItemPageResponse>(
        `${API_BASE_URL}/api/concerts?page=0&size=100`,
    );
    return response.contents ?? [];
}

export async function getConcertItems(): Promise<ConcertItem[]> {
    const concerts = await getConcertList();
    return concerts.map(toConcertItem);
}

export async function getConcertPage(
    query: PageRequest,
    status?: "open" | "upcoming",
) {
    const params = new URLSearchParams({
        page: String(query.page),
        size: String(query.size),
    });

    if (status) {
        params.set("status", status);
    }

    const response = await fetchJson<ConcertItemPageResponse>(
        `${API_BASE_URL}/api/concerts?${params.toString()}`,
    );

    return pageConvert(response, toConcertItem);
}

export async function getConcertSearchPage(
    query: PageRequest,
    keyword: string,
) {
    const params = new URLSearchParams({
        page: String(query.page),
        size: String(query.size),
    });

    if (keyword.trim()) {
        params.set("concertNames", keyword.trim());
    }

    const response = await fetchJson<ConcertItemPageResponse>(
        `${API_BASE_URL}/api/concerts?${params.toString()}`,
    );

    return pageConvert(response, toConcertSearchResult);
}

export async function getAdminConcert(id: number): Promise<AdminConcertDetailResponse> {
    return fetchJson<AdminConcertDetailResponse>(`${API_BASE_URL}/api/admin/concerts/${id}`, {
        headers: createJsonHeaders(),
    });
}

export async function getAdminConcertList(parameters: AdminConcertListPageParameters): Promise<AdminConcertDetailResponse[]> {
    const response = await getAdminConcertPage(
        {page: parameters.page, size: parameters.size},
        {
            concertName: parameters.concertName ?? "",
            concertCode: parameters.concertCode ?? "",
            venueName: parameters.venueName ?? "",
            venueCode: parameters.venueCode ?? "",
        },
    );

    return response.contents ?? [];
}

export async function getAdminConcertPage(
    query: PageRequest,
    filters: {
        concertName: string;
        concertCode: string;
        venueName: string;
        venueCode: string;
    },
): Promise<AdminConcertListPageResponse> {
    const params = new URLSearchParams({
        page: String(query.page),
        size: String(query.size),
    });

    if (filters.concertName.trim()) {
        params.set("concertNames", filters.concertName.trim());
    }
    if (filters.concertCode.trim()) {
        params.set("concertCode", filters.concertCode.trim());
    }
    if (filters.venueName.trim()) {
        params.set("venueNames", filters.venueName.trim());
    }
    if (filters.venueCode.trim()) {
        params.set("venueCode", filters.venueCode.trim());
    }

    return fetchJson<AdminConcertListPageResponse>(`${API_BASE_URL}/api/admin/concerts?${params.toString()}`, {
        headers: createJsonHeaders(),
    });
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

export async function updateConcertBasicInfo(
    command: AdminConcertUpdateBasicInfoCommand
): Promise<AdminConcertDetailResponse> {
    const formData = new FormData();

    formData.append(
        "request",
        new Blob([JSON.stringify(command.request)], {type: "application/json"}),
    );

    if (command.cardPoster) {
        formData.append("cardPoster", command.cardPoster);
    }
    if (command.bannerPoster) {
        formData.append("bannerPoster", command.bannerPoster);
    }
    if (command.descriptionPoster) {
        formData.append("descriptionPoster", command.descriptionPoster);
    }

    return fetchJson<AdminConcertDetailResponse>(
        `${API_BASE_URL}/api/admin/concerts/${command.pathVariables.id}/basic-info`,
        {
            method: "PATCH",
            headers: createMultipartHeaders(),
            body: formData,
        },
    );
}

// 기존 오타 함수명을 쓰는 코드가 있어도 깨지지 않도록 잠시 유지합니다.

export function getConcertListOnBanner() {
    return getConcertItems();
}

export function getConcertWithSeats(id: number) {
    return getAdminConcert(id);
}

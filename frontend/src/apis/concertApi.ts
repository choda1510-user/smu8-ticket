import type {
    ConcertDetail,
    ConcertDetailResponse,
    ConcertItem,
    ConcertItemPageResponse,
    ConcertItemResponse,
} from "@/types/concertF";
import type {
    AdminConcertCreateRequest,
    AdminConcertUpdateRequest,
    AdminConcertDetailResponse,
    AdminConcertItemPageResponse,
} from "@/types/adminConcert.ts";

import type {VenueSearch, VenueItemResponse} from "@/types/venue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const LOGIN_STORAGE_KEY = "smu8-ticket-login";

function getAccessToken() {
    const storedLogin = localStorage.getItem(LOGIN_STORAGE_KEY);

    if (!storedLogin) {
        return null;
    }

    try {
        const parsedLogin = JSON.parse(storedLogin) as { accessToken?: string };
        return parsedLogin.accessToken ?? null;
    } catch {
        localStorage.removeItem(LOGIN_STORAGE_KEY);
        return null;
    }
}

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

function toConcertItem(concert: ConcertItemResponse): ConcertItem {
    return {
        concertId: concert.concertId,
        title: concert.title,
        period: formatPeriodBySchedules(concert.dates),
        venueName: concert.venueName,
        badgeText: getBadgeText(concert.reservationStartAt)
    };
}

export function toConcertSearchResult(concert: ConcertDetailResponse): ConcertDetail {
    return {
        id = concert.id,
        venueId: concert.venueId,
        posterUrl: concert.posterUrl,
        runningTime : concert.runningTime.trim()
        venueName : concert.venueName,
        reservationPeriod : concert.reservationPeriod,
        schedules : concert.schedules.map(toConcertSchedule),

        ...toConcertItem(concert),
        venueId: concert.venueId,
    };
}

export function toConcertResult(concert: ConcertResponse): ConcertResult {
    return {
        id: concert.id,
        title: concert.title,
        period: formatPeriod(concert.startAt, concert.endAt),
        venueId: concert.venueId,
        venueName: concert.venueName,
        status: concert.reservationStatus === "OPEN" ? "예매중"
            : concert.reservationStatus === "BEFORE_OPEN" ? "오픈예정"
                : "예매종료",
    };
}

export function toVenueSearchResult(concerts: ConcertResponse[]): VenueItemResponse[] {
    const venueMap = new Map<number, VenueItemResponse>();

    concerts.forEach((concert) => {
        const existingVenue = venueMap.get(concert.venueId);

        if (existingVenue) {
            existingVenue.availableConcertCount += 1;
            return;
        }

        venueMap.set(concert.venueId, {
            venueId: concert.venueId,
            venueName: concert.venueName,
            availableConcertCount: 1,
        });
    });

    return Array.from(venueMap.values());
}

export function toVenueResult(concerts: ConcertResponse[]): VenueResult[] {
    return toVenueSearchResult(concerts).map((venue) => ({
        id: venue.venueId,
        venueName: venue.venueName,
        availableConcertCount: venue.availableConcertCount,
    }));
}

export function filterConcertsByKeyword(concerts: ConcertResponse[], keyword: string) {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
        return concerts;
    }

    return concerts.filter((concert) => {
        return (
            (concert.title ?? "").toLowerCase().includes(normalizedKeyword) ||
            (concert.description ?? "").toLowerCase().includes(normalizedKeyword) ||
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

export async function getConcert(id: number): Promise<ConcertResponse> {
    return fetchJson<ConcertResponse>(`${API_BASE_URL}/api/concerts/${id}`);
}

export async function getConcertList(): Promise<ConcertResponse[]> {
    const response = await fetchJson<ConcertPageResponse>(`${API_BASE_URL}/api/concerts`);
    return response.contents ?? [];
}

export async function getConcertItems(): Promise<ConcertItem[]> {
    const concerts = await getConcertList();
    return concerts.map(toConcertItem);
}

export async function getAdminConcert(id: number): Promise<ConcertResponse> {
    return fetchJson<ConcertResponse>(`${API_BASE_URL}/api/admin/concerts/${id}`, {
        headers: createJsonHeaders(),
    });
}

export async function getAdminConcertList(): Promise<ConcertResponse[]> {
    const response = await fetchJson<ConcertPageResponse>(`${API_BASE_URL}/api/admin/concerts`, {
        headers: createJsonHeaders(),
    });

    return response.contents ?? [];
}

export async function addConcert(request: AdminConcertRequest): Promise<ConcertResponse> {
    return fetchJson<ConcertResponse>(`${API_BASE_URL}/api/admin/concerts`, {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify(request),
    });
}

export async function updateConcert(id: number, request: AdminConcertRequest): Promise<ConcertResponse> {
    return fetchJson<ConcertResponse>(`${API_BASE_URL}/api/admin/concerts/${id}`, {
        method: "PATCH",
        headers: createJsonHeaders(),
        body: JSON.stringify(request),
    });
}

export async function cancelConcert(id: number): Promise<void> {
    await fetchEmpty(`${API_BASE_URL}/api/admin/concerts/${id}`, {
        method: "DELETE",
        headers: createJsonHeaders(),
    });
}

// 기존 오타 함수명을 쓰는 코드가 있어도 깨지지 않도록 잠시 유지합니다.
export const cancleConcert = cancelConcert;

export function getConcertListOnBanner() {
    return getConcertItems();
}

export function getConcertWithSeats(id: number) {
    return getAdminConcert(id);
}

import type {
    BookingCancelCommand,
    BookingConcertSeatFrameResponse,
    BookingCreateCommand,
    BookingDetailQuery,
    BookingDetailResponse,
    BookingItemResponse,
    BookingPageQuery,
    BookingPageResponse,
    BookingPreemptSeatCommand,
    ConcertSeatsStatusQuery,
} from "@/types/booking";
import {getAccessToken} from "@/apis/authApi";

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

function toReservationPageUrl(query: BookingPageQuery) {
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("size", String(query.size));

    return `${API_BASE_URL}/api/reservations?${params.toString()}`;
}

function toReservationSeatsUrl(query: ConcertSeatsStatusQuery) {
    const params = new URLSearchParams();
    params.set("concertId", String(query.concertId));
    params.set("scheduleId", String(query.scheduleId));

    return `${API_BASE_URL}/api/reservaions/preempt-seats?${params.toString()}`;
}

export function getBooking(query: BookingDetailQuery): Promise<BookingDetailResponse> {
    return fetchJson<BookingDetailResponse>(`${API_BASE_URL}/api/reservations/${query.reservationId}`, {
        headers: createJsonHeaders(),
    });
}

export function getBookingList(query: BookingPageQuery): Promise<BookingPageResponse> {
    return fetchJson<BookingPageResponse>(toReservationPageUrl(query), {
        headers: createJsonHeaders(),
    });
}

export function getBookingSeats(query: ConcertSeatsStatusQuery): Promise<BookingConcertSeatFrameResponse> {
    return fetchJson<BookingConcertSeatFrameResponse>(toReservationSeatsUrl(query), {
        headers: createJsonHeaders(),
    });
}

export function preemptBookingSeats(command: BookingPreemptSeatCommand): Promise<void> {
    return fetchEmpty(`${API_BASE_URL}/api/reservations/preempt-seats`, {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify({
            concertId: command.concertId,
            scheduleId: command.scheduleId,
            seatIds: command.seatIds,
        }),
    });
}

export function addBooking(command: BookingCreateCommand): Promise<BookingItemResponse> {
    return fetchJson<BookingItemResponse>(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify({
            concertId: command.concertId,
            scheduleId: command.scheduleId,
            seatIds: command.seatIds,
        }),
    });
}

export function cancelBooking(command: BookingCancelCommand): Promise<BookingItemResponse> {
    return fetchJson<BookingItemResponse>(`${API_BASE_URL}/api/reservations/${command.reservationId}`, {
        method: "DELETE",
        headers: createJsonHeaders(),
    });
}
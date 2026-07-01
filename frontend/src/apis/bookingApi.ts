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

// 백엔드 ErrorResponse에서 사용자에게 보여줄 안내 메시지만 읽기 위한 타입입니다.
type ApiErrorResponse = {
    message?: string;
};

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

// 409 제한 초과 메시지를 화면까지 전달하기 위해 JSON 에러 응답의 message를 Error에 담습니다.
async function createApiError(response: Response) {
    let message = `API request failed. status=${response.status}`;

    try {
        const contentType = response.headers.get("Content-Type") ?? "";

        if (contentType.includes("application/json")) {
            const errorBody = (await response.json()) as ApiErrorResponse;
            message = errorBody.message || message;
        }
    } catch {
        return new Error(message);
    }

    return new Error(message);
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw await createApiError(response);
    }

    return (await response.json()) as T;
}

async function fetchEmpty(url: string, options?: RequestInit): Promise<void> {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw await createApiError(response);
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

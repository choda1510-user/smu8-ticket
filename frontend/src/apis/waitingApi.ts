import {getAccessToken} from "@/apis/authApi";

const WAITING_API_BASE_URL = import.meta.env.VITE_WAITING_API_BASE_URL ?? "http://localhost:8081";

export type WaitingQueueEntryResponse = {
    concertId: string;
    accountId: string;
    entered: boolean;
    active: boolean;
    rank: number | null;
    waitingCount: number;
};

export type WaitingQueueStatusResponse = {
    concertId: string;
    accountId: string;
    active: boolean;
    waiting: boolean;
    rank: number | null;
    waitingCount: number;
    reservationOpen: boolean;
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

export async function getWaitingQueueStatus(concertId: number | string): Promise<WaitingQueueStatusResponse> {
    const response = await fetch(`${WAITING_API_BASE_URL}/api/waiting/concerts/${concertId}/queue`, {
        headers: createJsonHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Waiting queue status request failed. status=${response.status}`);
    }

    return await response.json() as WaitingQueueStatusResponse;
}

export async function enterWaitingQueue(concertId: number | string): Promise<WaitingQueueEntryResponse> {
    const response = await fetch(`${WAITING_API_BASE_URL}/api/waiting/concerts/${concertId}/queue`, {
        method: "POST",
        headers: createJsonHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Waiting queue request failed. status=${response.status}`);
    }

    return await response.json() as WaitingQueueEntryResponse;
}

export async function leaveWaitingQueue(concertId: number | string): Promise<void> {
    const response = await fetch(`${WAITING_API_BASE_URL}/api/waiting/concerts/${concertId}/queue`, {
        method: "DELETE",
        headers: createJsonHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Waiting queue leave request failed. status=${response.status}`);
    }
}

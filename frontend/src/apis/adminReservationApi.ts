import {getAccessToken} from "@/apis/authApi";
import type {AdminReservationPageResponse} from "@/types/adminReservation";

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

export async function getAdminReservationList(page: number, size: number, accountId = "") {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));

    if (accountId.trim()) {
        params.set("accountId", accountId.trim());
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/reservations?${params.toString()}`, {
        headers: createJsonHeaders(),
    });

    if (!response.ok) {
        throw new Error(`API request failed. status=${response.status}`);
    }

    return await response.json() as AdminReservationPageResponse;
}

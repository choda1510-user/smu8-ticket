import type {VenueSearch} from "@/types/venue"
import type {
    AdminVenueCreateRequest,
    AdminVenueUpdateRequest,
    AdminVenueItemResponse,
    AdminVenuePageResponse,
    AdminVenueDetailResponse,
    AdminVenueCreateResponse,
    AdminVenueUpdateResponse,
} from "@/types/adminVenue";
import { getAccessToken } from "./authApi";
import type {PageRequest} from "@/types/api";

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

export function getVenueAddress(venue: AdminVenueItemResponse) {
    return [
        venue.roadAddress,
        venue.jibunAddress,
        venue.detailAddress,
        venue.buildingName,
    ].filter(Boolean).join(" ");
}

export function toVenueSearchResult(venue: AdminVenueItemResponse): VenueSearch {
    return {
        id: venue.id,
        venueName: venue.name,
        availableConcertCount: 0,
    };
}

export function toVenueResult(venue: AdminVenueItemResponse): VenueSearch {
    return {
        id: venue.id,
        venueName: venue.name,
        availableConcertCount: 0,
    };
}

export function filterVenuesByKeyword(venues: AdminVenueItemResponse[], keyword: string) {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
        return venues;
    }

    return venues.filter((venue) => {
        const venueName = venue.name || "";
        const venueAddress = getVenueAddress(venue);

        return (
            venueName.toLowerCase().includes(normalizedKeyword) ||
            venueAddress.toLowerCase().includes(normalizedKeyword)
        );
    });
}

export async function getVenue(id: number): Promise<AdminVenueDetailResponse> {
    return fetchJson<AdminVenueDetailResponse>(`${API_BASE_URL}/api/venues/${id}`);
}

export async function getVenueList(): Promise<AdminVenueItemResponse[]> {
    const response = await fetchJson<AdminVenuePageResponse>(`${API_BASE_URL}/api/venues`);
    return response.contents ?? [];
}

export async function getAdminVenue(id: number): Promise<AdminVenueDetailResponse> {
    return fetchJson<AdminVenueDetailResponse>(`${API_BASE_URL}/api/admin/venues/${id}`, {
        headers: createJsonHeaders(),
    });
}

export async function getAdminVenueList(): Promise<AdminVenueItemResponse[]> {
    const response = await getAdminVenuePage(
        {page: 0, size: 100},
        {venueCode: "", venueName: ""},
    );

    return response.contents ?? [];
}

export async function getAdminVenuePage(
    query: PageRequest,
    filters: {
        venueCode: string;
        venueName: string;
    },
): Promise<AdminVenuePageResponse> {
    const params = new URLSearchParams({
        page: String(query.page),
        size: String(query.size),
    });

    if (filters.venueCode.trim()) {
        params.set("venueCode", filters.venueCode.trim());
    }
    if (filters.venueName.trim()) {
        params.set("venueNames", filters.venueName.trim());
    }

    return fetchJson<AdminVenuePageResponse>(`${API_BASE_URL}/api/venues?${params.toString()}`, {
        headers: createJsonHeaders(),
    });
}

export async function addVenue(request: AdminVenueCreateRequest): Promise<AdminVenueCreateResponse> {
    const accessToken = getAccessToken();

    if (!accessToken) {
        throw new Error("관리자 로그인이 필요합니다.");
    }

    return fetchJson<AdminVenueCreateResponse>(`${API_BASE_URL}/api/admin/venues`, {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify(request),
    });
}

export async function updateVenue(id: number, request: AdminVenueUpdateRequest): Promise<AdminVenueUpdateResponse> {
    return fetchJson<AdminVenueUpdateResponse>(`${API_BASE_URL}/api/admin/venues/${id}`, {
        method: "PATCH",
        headers: createJsonHeaders(),
        body: JSON.stringify(request),
    });
}

export async function removeVenue(id: number): Promise<void> {
    await fetchEmpty(`${API_BASE_URL}/api/admin/venues/${id}`, {
        method: "DELETE",
        headers: createJsonHeaders(),
    });
}

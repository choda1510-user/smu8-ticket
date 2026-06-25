import type {
    AdminVenueCreateRequest,
    AdminVenueUpdateRequest,
    BackendVenue,
    BackendVenueListResponse,
    VenueResult,
    VenueSearchResponse,
} from "@/types/venue";

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

export function getVenueAddress(venue: BackendVenue) {
    return venue.address || [venue.roadAddress, venue.detailAddress].filter(Boolean).join(" ");
}

export function toVenueSearchResult(venue: BackendVenue): VenueSearchResponse {
    return {
        venueId: venue.id,
        venueName: venue.venue_name || venue.name || "",
        availableConcertCount: 0,
    };
}

export function toVenueResult(venue: BackendVenue): VenueResult {
    return {
        id: venue.id,
        venueName: venue.venue_name || venue.name || "",
        availableConcertCount: 0,
    };
}

export function filterVenuesByKeyword(venues: BackendVenue[], keyword: string) {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
        return venues;
    }

    return venues.filter((venue) => {
        const venueName = venue.venue_name || venue.name || "";
        const venueAddress = getVenueAddress(venue);

        return (
            venueName.toLowerCase().includes(normalizedKeyword) ||
            venueAddress.toLowerCase().includes(normalizedKeyword) ||
            (venue.venue_code ?? "").toLowerCase().includes(normalizedKeyword)
        );
    });
}

export async function getVenue(id: number): Promise<BackendVenue> {
    return fetchJson<BackendVenue>(`${API_BASE_URL}/api/venues/${id}`);
}

export async function getVenueList(): Promise<BackendVenue[]> {
    const response = await fetchJson<BackendVenueListResponse>(`${API_BASE_URL}/api/venues`);
    return response.venues ?? response.contents ?? [];
}

export async function getAdminVenue(id: number): Promise<BackendVenue> {
    return fetchJson<BackendVenue>(`${API_BASE_URL}/api/admin/venues/${id}`, {
        headers: createJsonHeaders(),
    });
}

export async function getAdminVenueList(): Promise<BackendVenue[]> {
    const response = await fetchJson<BackendVenueListResponse>(`${API_BASE_URL}/api/admin/venues`, {
        headers: createJsonHeaders(),
    });

    return response.venues ?? response.contents ?? [];
}

export async function addVenue(request: AdminVenueCreateRequest): Promise<BackendVenue> {
    const accessToken = getAccessToken();

    if (!accessToken) {
        throw new Error("관리자 로그인이 필요합니다.");
    }

    return fetchJson<BackendVenue>(`${API_BASE_URL}/api/admin/venues`, {
        method: "POST",
        headers: createJsonHeaders(),
        body: JSON.stringify(request),
    });
}

export async function updateVenue(id: number, request: AdminVenueUpdateRequest): Promise<BackendVenue> {
    return fetchJson<BackendVenue>(`${API_BASE_URL}/api/admin/venues/${id}`, {
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

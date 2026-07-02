import type { AuthTokenResponse } from "@/types/auth";
import type {
    AvailabilityResponse,
    AccountDetailResponse,
    LoginRequest,
    SignUpRequest,
    UpdateAccountRequest,
    AccountMyInfoResponse,
} from "@/types/member.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

function createBasicAuthorization(username: string, password: string) {
    return `Basic ${btoa(`${username}:${password}`)}`;
}

async function parseTokenResponse(response: Response): Promise<AuthTokenResponse> {
    const token = (await response.json()) as Partial<AuthTokenResponse>;

    if (!token.tokenValue) {
        throw new Error("Token response does not include tokenValue.");
    }

    return token as AuthTokenResponse;
}

async function checkAvailability(url: string): Promise<boolean> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Availability check failed.");
    }

    const result = (await response.json()) as AvailabilityResponse;

    return result.available;
}

export function checkLoginId(loginId: string): Promise<boolean> {
    return checkAvailability(`${API_BASE_URL}/api/account/check-username?username=${encodeURIComponent(loginId)}`);
}

export function checkNickname(nickname: string): Promise<boolean> {
    return checkAvailability(`${API_BASE_URL}/api/account/check-nickname?nickname=${encodeURIComponent(nickname)}`);
}

// 회원가입 요청 함수
export async function signUp(request: SignUpRequest): Promise<AccountDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/api/account`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: request.loginId,
            password: request.password,
            nickname: request.nickname,
        }),
    });

    if (!response.ok) {
        throw new Error("Sign up failed.");
    }

    return (await response.json()) as AccountDetailResponse;
}

// 토큰 요청 함수
export async function login(request: LoginRequest): Promise<AuthTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/token`, {
        method: "POST",
        headers: {
            Authorization: createBasicAuthorization(request.username, request.password),
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Login failed.");
    }

    return await parseTokenResponse(response);
}
// 로그아웃 요청 함수
export async function logout(accessToken?: string | null): Promise<void> {
    if (!accessToken) {
        return;
    }

    await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
    });
}
// 사용자 정보 요청 함수
export async function getAccount(userId?: string | null): Promise<AccountDetailResponse | null> {
    if (!userId) {
        return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/account/${userId}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch account.");
    }

    return (await response.json()) as AccountDetailResponse;
}
// 자기 자신의 정보 요청 함수
export async function getMyInfo(accessToken?: string | null): Promise<AccountMyInfoResponse | null> {
    if (!accessToken) {
        return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/account/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new ApiError("Failed to fetch information.", response.status);
    }

    return (await response.json()) as AccountMyInfoResponse;
}
export async function updateAccount(
    accessToken: string,
    request: UpdateAccountRequest,
): Promise<AccountMyInfoResponse> {
    const response = await fetch(`${API_BASE_URL}/api/account/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Failed to update account.");
    }

    return (await response.json()) as AccountMyInfoResponse;
}

export function withdraw() {

}

export async function refresh(): Promise<AuthTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/refresh`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Refresh failed.");
    }

    return parseTokenResponse(response);
}

import type {
    AuthTokenResponse,
    AvailabilityResponse,
    AccountResponse,
    LoginRequest,
    LoginResponse,
    LoginUser,
    SignUpRequest,
    UpdateAccountRequest,
} from "@/types/member.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function createBasicAuthorization(loginId: string, password: string) {
    return `Basic ${btoa(`${loginId}:${password}`)}`;
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

export async function signUp(request: SignUpRequest): Promise<AccountResponse> {
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

    return (await response.json()) as AccountResponse;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/token`, {
        method: "GET",
        headers: {
            Authorization: createBasicAuthorization(request.loginId, request.password),
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Login failed.");
    }

    const token = await parseTokenResponse(response);
    const account = await getAccount(token.tokenValue);
    const user: LoginUser = {
        loginId: account?.username ?? request.loginId,
        nickname: account?.nickname ?? request.loginId,
        role: request.loginId === "admin" ? "ADMIN" : "USER",
    };

    return {
        accessToken: token.tokenValue,
        user,
    };
}

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

export async function getAccount(accessToken?: string | null): Promise<AccountResponse | null> {
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
        throw new Error("Failed to fetch account.");
    }

    return (await response.json()) as AccountResponse;
}

export async function updateAccount(
    accessToken: string,
    request: UpdateAccountRequest,
): Promise<AccountResponse> {
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

    return (await response.json()) as AccountResponse;
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

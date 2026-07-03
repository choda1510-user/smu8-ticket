

const LOGIN_STORAGE_KEY = "smu8-ticket-login";
export const SESSION_EXPIRED_EVENT_NAME = "smu8-ticket-session-expired";

function decodeBase64Url(value: string) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    return atob(paddedBase64);
}

function isAccessTokenExpired(accessToken: string) {
    try {
        const [, payload] = accessToken.split(".");

        if (!payload) {
            return false;
        }

        const claims = JSON.parse(decodeBase64Url(payload)) as {exp?: number};

        if (!claims.exp) {
            return false;
        }

        return Date.now() >= claims.exp * 1000;
    } catch {
        return false;
    }
}

function dispatchSessionExpiredEvent() {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT_NAME));
}

// 로컬 스토리지에서 엑세스 토큰을 가져오는 함수
export function getAccessToken(): string | null{
    const storedLogin = localStorage.getItem(LOGIN_STORAGE_KEY);

    if (!storedLogin) {
        return null;
    }

    if (isAccessTokenExpired(storedLogin)) {
        delAccessToken();
        dispatchSessionExpiredEvent();
        return null;
    }

    return storedLogin;
}
// 로컬 스토리지에 엑세스 토큰을 저장하는 함수
export function setAccessToken(accessToken: string) {
    localStorage.setItem(LOGIN_STORAGE_KEY, accessToken);
}
// 로컬 스토리지의 엑세스 토큰을 삭제하는 함수
export function delAccessToken() {
    localStorage.removeItem(LOGIN_STORAGE_KEY);
}

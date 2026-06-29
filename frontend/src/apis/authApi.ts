

const LOGIN_STORAGE_KEY = "smu8-ticket-login";

// 로컬 스토리지에서 엑세스 토큰을 가져오는 함수
export function getAccessToken(): string | null{
    const storedLogin = localStorage.getItem(LOGIN_STORAGE_KEY);

    if (!storedLogin) {
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
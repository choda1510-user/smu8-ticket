import type {HomeBannerResponse} from "@/types/home";

// 백엔드 주소를 환경변수에서 읽어 배포/로컬 환경 변경에 대응합니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
        // 호출 실패를 상위 훅에서 처리할 수 있도록 예외로 전달합니다.
        throw new Error(`API request failed. status=${response.status}`);
    }

    return (await response.json()) as T;
}

export async function getHomeBanners(): Promise<HomeBannerResponse[]> {
    // 홈 배너만 새 API에서 가져와 공연 목록 API와 배너 선정 책임을 분리합니다.
    return fetchJson<HomeBannerResponse[]>(`${API_BASE_URL}/api/home/banners`);
}

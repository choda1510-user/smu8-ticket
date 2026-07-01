import type {HomeConcertCard} from "@/types/concert";

// 홈 배너 UI가 실제로 사용하는 최소 데이터 구조입니다.
export type BannerItem = {
    concertId: number;
    title: string;
    imageUrl?: string;
};

// 현재 백엔드 응답과 화면 모델이 같아서 별칭으로 두고, 나중에 응답 필드가 바뀌면 여기서 분리합니다.
export type HomeBannerResponse = BannerItem;

export type HomeOpenConcertItem = HomeConcertCard;
export type HomeUpcomingConcertItem = HomeConcertCard;

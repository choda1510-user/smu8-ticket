import type {PageRequest, PageResponse, PageResult} from "@/types/api";

export type ReservationStatus = "BEFORE_OPEN" | "OPEN" | "CLOSED"; // 예매 오픈 전, 예매 가능, 예매 종료 상태

export type ConcertScheduleResponse = {
    id: number; // 공연 회차 고유 ID
    date: string; // 공연 날짜 및 시간
    reservationEndAt: string; // 예매 종료일시
}
export type ConcertSchedule = { //상세페이지 내에 회차정보
    id: number; // 공연 회차 고유 ID
    date: string; // 공연 날짜 (예: "2026-06-24")
    time: string; // 공연 시간 (예: "19:30")
    datetime: Date;
    reservationEndAt: string; // 예매 종료일시
};

export type ConcertDetailResponse = { // 공연 상세페이지 백엔드 응답
    id: number; // 공연 고유 ID
    title: string; // 화면에 표시할 공연 제목
    description: string; // 공연 설명
    posterUrl: string; // 공연 카드 포스터 이미지 주소
    schedules: ConcertScheduleResponse[]; // 공연 회차 목록
    runningTime: string; // 공연 러닝타임
    venueId: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    reservationStartAt: string; // 예매 오픈 시작일시
    rowMax: number, // 좌석 행 개수
    colMax: number, // 좌석 열 개수
    createdAt: string, // 생성일시
    updatedAt: string, // 수정일시
}
export type ConcertDetail = { // 공연 상세페이지
    id: number; // 공연 고유 ID
    venueId: number; // 공연장 고유 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    concertTitle: string; // 화면에 표시할 공연 제목
    concertPeriod: string; // 화면에 표시할 공연 기간
    runningTime: string; // 공연 러닝타임
    venueName: string; // 공연장 이름
    reservationPeriod: string; // 예매 가능 기간
    schedules: ConcertSchedule[]; // 공연 회차 목록
    description?: string; // 공연 설명
    startAt: string; // 백엔드에서 내려주는 공연 시작일시
    endAt: string; // 백엔드에서 내려주는 공연 종료일시
    reservationStartAt?: string; // 예매 오픈 시작일시
};
export type ConcertItemResponse = { // 공연 목록 백엔드 응답
    concertId: number; // 화면에서 사용하는 공연 ID
    cardPosterUrl?: string; // 공연 포스터 이미지 주소
    bannerPosterUrl?: string // 공연 배너 이미지 주소
    title: string; // 공연 제목
    dates: ConcertScheduleResponse[] // 공연 날짜들
    reservationStartAt: string; // 예매 오픈 시작일시
    venueId: number // 공연장 고유 ID
    venueName: string; // 공연장 이름
}

export type ConcertItem = {
    concertId: number; // 화면에서 사용하는 공연 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    title: string; // 공연 제목
    period: string; // 화면에 표시할 공연 기간
    venueId: number // 공연장 고유 Id
    venueName: string; // 공연장 이름
    badgeText: string; // 화면에 표시할 상태 문구

};

export type HomeConcertCard = { // 홈 화면 공연 카드 목록
    concertId: number; // 홈 화면에서 사용하는 공연 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    title: string; // 공연 제목
    reservationPeriod: string; // 예매 기간
    reservationEndDate: string; // 예매 종료일
    badgeText: string; // 화면에 표시할 상태 문구
};
export type HomeBannerConcertItem = {
    concertId: number; // 공연 ID
    posterUrl?: string; // 공연 배너 이미지 주소
    title: string; // 공연 이름
};

export type ConcertItemPageResponse = PageResponse<ConcertItemResponse>; // 백엔드 공연 목록 응답 타입
export type ConcertItemPageResult = PageResult<ConcertItem>; // 화면용 공연 목록 응답 타입
export type HomeBannerConcertListResponse = ConcertItemResponse[]; // 홈페이지 배너 목록 백엔드 응답 타입
export type HomeBannerConcertList = HomeBannerConcertItem[]; // 홈페이지 배너 목록 타입

export type ConcertPageRequest = PageRequest & {
    concert_name?: string; // 공연명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_name?: string; // 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_code?: string; // 공연장 코드로 검색할 때 URL 쿼리 파라미터로 보낼 값
    status?: string // 공연상태로 검색할 때 URL 쿼리 파라미터로 보낼 값
};

export type ConcertDetailRequest = {
    id: number; // 상세 조회 URL에 path variable로 보낼 공연 고유 ID
};
export type SeatGradeResponse = {
    id: number; // 좌석등급 Id
    gradeName: string; // 좌석등급 이름
    price: number; // 좌석등급 가격
    color: string; // 좌석등급 색 (예: #fafafa)
}
export type SeatResponse = {
    id: number; // 좌석 Id
    seatGradeId: number; // 좌석등급 Id
    row: number; // 좌석 행 위치
    col: number; // 좌석 열 위치
}